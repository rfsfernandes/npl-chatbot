const Reservation = require("./reservation");
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
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

  getDefaultAnswer() {
    return this.defaultAnswer;
  }

  handleResponse(intent, entities) {
    let message = this.defaultAnswer;

    switch (intent[0].name) {
      case "room_reservation":
        message = this.handleReservation(entities);
        break;
    }

    return message;
  }

  handleReservation(entities) {
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
      for (var key in this.reservation) {
        if (!this.reservation[key]) {
          message = this.file.room_reservation[`missing_${key}`];
          missingProperty = true;
        }
      }

      if(!missingProperty) {
          const date = new Date(this.reservation.datetime);
          message = this.file.room_reservation.reservation_success + "<br>" + "<ul>" + 
          "<li>Número de quartos: " + this.reservation.room_quantity + "</li>" +
          "<li>Número de camas: " + this.reservation.bed_quantity + "</li>" +
          "<li>Tipo de camas: " + this.reservation.bed_type + "</li>" +
          "<li>Data: " + date.getUTCDate() + " " + monthNames[date.getUTCMonth()] + " " + (date.getFullYear() - 1) + "</li>" +
          "</ul>";
      }

    } else {
      message = this.file.room_reservation.room_reservation_question;
    }

    return message;
  }

};
