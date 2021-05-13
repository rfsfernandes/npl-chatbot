const Reservation = require("./reservation");
const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

module.exports = class ResponseHandler {
  file;
  defaultAnswer;
  reservation;

  constructor(file) {
    this.file = file;
    this.defaultAnswer = file.default_answer;
    this.reservation = new Reservation();
  }

  getDefaultAnswer = () => {
    return this.defaultAnswer;
  };

  handleResponse = (res, req, intent, entities) => {
    let message = this.defaultAnswer;

    switch (intent[0].name) {
      case "room_reservation":
        message = this.handleReservation(res, req, entities);
        break;
      case "room_change":
        message = this.handleReservationChange(req, res, entities);
        break;
    }

    return message;
  };

  handleReservation = (res, req, entities) => {
    let reservationQuestion = false;
    let message = this.defaultAnswer;

    for (var key in entities) {
      if (entities.hasOwnProperty(key)) {
        if (entities[key][0].role != "room_reservation_question") {
          this.reservation[entities[key][0].role] = entities[key][0].value;
        } else {
          reservationQuestion = true;
          break;
        }
      }
    }

    if (!reservationQuestion) {
      let missingProperty = false;

      let cookie_room_reservation = this.readCookie(req, "room_reservation");

      if (cookie_room_reservation) {
        this.reservation = cookie_room_reservation;
        message = this.file.room_reservation.room_already_reserved;
      } else {
  
        for (var key in this.reservation) {
          if (!this.reservation[key]) {
            message = this.file.room_reservation[`missing_${key}`];
            missingProperty = true;
          }
        }

        if (!missingProperty) {
          const date = new Date(this.reservation.datetime);
          this.reservation.datetime = date;

          this.saveCookie(res, "room_reservation", this.reservation);
          message =
            this.file.room_reservation.reservation_success +
            "<br>" +
            "<ul>" +
            "<li>Número de quartos: " +
            this.reservation.room_quantity +
            "</li>" +
            "<li>Número de camas: " +
            this.reservation.bed_quantity +
            "</li>" +
            "<li>Tipo de camas: " +
            this.reservation.bed_type +
            "</li>" +
            "<li>Data: " +
            this.reservation.datetime.getUTCDate() +
            " " +
            monthNames[this.reservation.datetime.getUTCMonth()] +
            " " +
            this.reservation.datetime.getFullYear() +
            "</li>" +
            "</ul>";
        }
      }
    } else {
      message = this.file.room_reservation.room_reservation_question;
    }

    return message;
  };

  handleReservationChange = (res, req, entities) => {
    let cookie_room_reservation = this.readCookie(req, "room_reservation");

    if (cookie_room_reservation) {
      this.reservation = cookie_room_reservation;
      message = this.file.room_reservation.room_already_reserved;
    } else {
      message = this.file.room_change.room_not_reserved_yet;
    }

    return message;

  }

  saveCookie = (res, cookieName, cookieValue) => {
    res.cookie(cookieName, cookieValue);
  };

  readCookie = (req, cookieName) => {
    console.log(req.cookies);
    if (req.cookies) return req.cookies[cookieName];
    else return undefined;
  };
};
