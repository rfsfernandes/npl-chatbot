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

const conversation_states = [
  "room_reservation", // 0
  "room_change", // 1
  "room_cancel", // 2
  "room_service", // 3
  "gym_access", // 4
  "cafe_reservation", // 5
  "pool_access", // 6
];

let current_state = undefined;

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

  handleResponse = (res, req, intents, entities) => {
    let message = this.defaultAnswer;
    console.log(intents);
    console.log(entities);
    let intent = {confidence: 0};

    for (let current_intent of intents) {
      if (current_intent.confidence > intent.confidence) {
        intent = current_intent;
      }
    }

    //console.log(intent);
    if (intent.name != "confirmation") {
      current_state = intent.name;
    }

    //console.log(current_state);

    switch (current_state == undefined ? intent.name : current_state) {
      case "room_reservation":
        message = this.handleReservation(res, req, entities);
        break;
      case "room_change":
        message = this.handleReservationChange(req, res, entities);
        break;
      case "gym_access":
        message = this.handleGymAccess(req, res, entities);
        break;
      case "pool_access":
        message = this.handlePoolAccess(req, res, entities);
        break;

    }

    return message;
  };

  handleReservation = (res, req, entities) => {
    let reservationQuestion = false;
    let message = this.defaultAnswer;

    for (let key in entities) {
      if (entities.hasOwnProperty(key)) {
        if (
          entities[key][0].role != "room_reservation_question" &&
          entities[key][0].role != "confirmation"
        ) {
          this.reservation[entities[key][0].role] = entities[key][0].value;
        } else if (
          entities[key][0].role == "confirmation"
        ) {
          this.reservation.confirmation = entities[key][0].role;
        } else if (entities[key][0].role == "room_reservation_question") {
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
        console.log(this.reservation);
        for (let key in this.reservation) {
          
          if (!this.reservation[key]) {
            message = this.file.room_reservation[`missing_${key}`];
            missingProperty = true;
            break;
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
  };

  handleGymAccess = (res, req, entities) => {
    let message = this.defaultAnswer;
    let obj = false;
    let gym = false;
    let price = false;

    for (let key in entities) {
  
      if (entities.hasOwnProperty(key)) {
        if (entities[key][0].role == "gym") {
          gym = true;
        } else if (entities[key][0].role == "gym_machines") {
          obj = true;
        } else if (entities[key][0].role == "access_price") {
          price = true;
        }
      }
    }

    if(gym && price || price){
      message = this.file.gym_access.access_price[Math.floor(Math.random() * this.file.gym_access.access_price.length)];
    }else if(gym && obj || obj){
      message = this.file.gym_access.gym_machines[Math.floor(Math.random() * this.file.gym_access.gym_machines.length)];
    }else if(gym){
      message = this.file.gym_access.gym[Math.floor(Math.random() * this.file.gym_access.gym.length)];
    }

    return message;
  };

  handlePoolAccess = (res, req, entities) => {
    let message = this.defaultAnswer;
    let obj = false;
    let pool = false;
    let price = false;

    for (let key in entities) {
  
      if (entities.hasOwnProperty(key)) {
        if (entities[key][0].role == "pool") {
          pool = true;
        } else if (entities[key][0].role == "pool_objects") {
          obj = true;
        } else if (entities[key][0].role == "access_price") {
          price = true;
        }
      }
    }

    if(pool && price || price){
      message = this.file.pool_access.access_price[Math.floor(Math.random() * this.file.pool_access.access_price.length)];
    }else if(pool && obj || obj){
      message = this.file.pool_access.pool_machines[Math.floor(Math.random() * this.file.pool_access.pool_machines.length)];
    }else if(pool){
      message = this.file.pool_access.pool[Math.floor(Math.random() * this.file.pool_access.pool.length)];
    }

    return message;
  };

  saveCookie = (res, cookieName, cookieValue) => {
    res.cookie(cookieName, cookieValue);
  };

  readCookie = (req, cookieName) => {
    console.log(req.cookies);
    if (req.cookies) return req.cookies[cookieName];
    else return undefined;
  };
};
