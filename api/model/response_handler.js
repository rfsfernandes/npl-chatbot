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

const single_bed_price = 35;
const couple_bed_price = 65;

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
let message = this.defaultAnswer;
let change_question_made = false;
let temp_reservation = new Reservation();
let waiting_cancel = false;

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
    //console.log(intents);
    //console.log(entities);
    let intent = { confidence: 0 };

    for (let current_intent of intents) {
      if (current_intent.confidence > intent.confidence) {
        intent = current_intent;
      }
    }

    //console.log(intent);
    if (intent.name != "confirmation") {
      this.current_state = intent.name;
    }

    //console.log(this.current_state);

    switch (this.current_state == undefined ? intent.name : this.current_state) {
      case "room_reservation":
        this.message = this.handleReservation(res, req, entities);
        break;
      case "room_change":
        this.message = this.handleReservationChange(res, req, entities);
        break;
      case "room_cancel":
        this.message = this.handleReservationCancel(res, req, entities);
        break;
      case "gym_access":
        this.message = this.handleGymAccess(res, req, entities);
        break;
      case "pool_access":
        this.message = this.handlePoolAccess(res, req, entities);
        break;
    }

    return this.message;
  };

  handleReservation = (res, req, entities) => {
    this.temp_reservation = new Reservation();
    let reservationQuestion = false;

    if (
      entities.hasOwnProperty("meal_price:meal_price") &&
      (entities.hasOwnProperty("room_quantity:room_quantity") ||
        entities.hasOwnProperty("bed_quantity:bed_quantity") ||
        entities.hasOwnProperty("bed_type:bed_type"))
    ) {
      this.message = this.file.room_reservation.reservation_prices[
        this.getRandom(this.file.room_reservation.reservation_prices.length)
      ]
        .replace("{0}", this.couple_bed_price)
        .replace("{1}", this.single_bed_price);
    } else {
      for (let key in entities) {
        if (entities.hasOwnProperty(key)) {
          if (
            entities[key][0].role != "room_reservation_question" &&
            entities[key][0].role != "confirmation"
          ) {
            this.reservation[entities[key][0].role] = entities[key][0].value;
          } else if (entities[key][0].role == "confirmation") {
            let value = false;

            if (entities[key][0].value == "true") {
              value = true;
            }

            this.reservation.confirmation = value;
          } else if (entities[key][0].role == "room_reservation_question") {
            reservationQuestion = true;
            break;
          }
        }
      }

      if (!reservationQuestion) {
        let missingProperty = false;

        let cookie_room_reservation = this.readCookie(req, "room_reservation");

        if (cookie_room_reservation != undefined) {
          this.reservation = cookie_room_reservation;
          this.message =
            this.file.room_reservation.room_already_reserved[
              this.getRandom(
                this.file.room_reservation.room_already_reserved.length
              )
            ];
        } else {
          for (let key in this.reservation) {
            if (!this.reservation[key]) {
              if (key == "confirmation") {
                console.log(
                  this.file.room_reservation.missing_confirmation[
                    this.getRandom(
                      this.file.room_reservation.missing_confirmation.length
                    )
                  ]
                );
                this.message =
                  this.file.room_reservation.missing_confirmation[
                    this.getRandom(
                      this.file.room_reservation.missing_confirmation.length
                    )
                  ] +
                  " O preço da sua reserva é: " +
                  this.reservation.room_quantity *
                    (this.reservation.bed_type.includes("casal")
                      ? this.couple_bed_price * this.reservation.bed_quantity
                      : this.single_bed_price * this.reservation.bed_quantity) +
                  "€";
              } else {
                this.message =
                  this.file.room_reservation[`missing_${key}`][
                    this.getRandom(
                      this.file.room_reservation[`missing_${key}`].length
                    )
                  ];
              }
              missingProperty = true;
              break;
            }
          }

          if (!missingProperty) {
            if (this.reservation.confirmation == true) {
              const date = new Date(this.reservation.datetime);
              this.reservation.datetime = date;
              const bed_id = this.getRandom(500);

              let bed_ids_string = "";

              for (
                let index = 0;
                index < this.reservation.room_quantity;
                index++
              ) {
                bed_ids_string = bed_ids_string + " " + (bed_id + index);
              }

              this.reservation.bed_ids = bed_ids_string;
              this.saveCookie(res, "room_reservation", this.reservation);

              this.message =
                this.file.room_reservation.reservation_success[
                  this.getRandom(
                    this.file.room_reservation.reservation_success.length
                  )
                ] + this.getResume();
            } else {
              this.message =
                this.file.room_reservation.reservation_fail[
                  this.getRandom(
                    this.file.room_reservation.reservation_fail.length
                  )
                ];
            }
          }
        }
      } else {
        this.message = this.file.room_reservation.room_reservation_question;
      }
    }

    return this.message;
  };

  handleReservationChange = (res, req, entities) => {
    let cookie_room_reservation = this.readCookie(req, "room_reservation");
  
    if (cookie_room_reservation != undefined) {
      this.reservation = cookie_room_reservation;

      if (Object.keys(entities).length === 0) {
        
        if (!this.change_question_made) {
          this.message =
            this.file.room_change.room_change_intro[
              this.getRandom(this.file.room_change.room_change_intro.length)
            ];
          this.change_question_made = true;
        }
      } else {
        this.change_question_made = false;

        for (let key in entities) {
          if (entities[key][0].role == "confirmation") {
            let value = false;
            if (entities[key][0].value == "true") {
              value = true;
            }

            this.temp_reservation.confirmation = value;
          } else {
            this.temp_reservation[entities[key][0].role] = entities[key][0].value;
          }
        }

        if(this.temp_reservation.datetime != undefined) {
          const date = new Date(this.temp_reservation.datetime);
          this.temp_reservation.datetime = date;
        }

        if (this.temp_reservation.confirmation != undefined) {
          
          if (this.temp_reservation.confirmation) {
            console.log("Confirmation true");
            for (const key in this.reservation) {
              if (this.temp_reservation[key] != undefined) {
                this.reservation[key] = this.temp_reservation[key];
              }
            }

            this.saveCookie(res, "room_reservation", this.reservation);
            this.temp_reservation = new Reservation();
            this.message =
              this.file.room_change.change_success[
                this.getRandom(this.file.room_change.change_success.length)
              ];
          } else {
            this.message =
              this.file.room_change.change_fail[
                this.getRandom(this.file.room_change.change_fail.length)
              ];
          }
        } else {
          if (
            (this.temp_reservation.bed_quantity != undefined && (this.temp_reservation.bed_quantity > this.reservation.bed_quantity ||
            this.temp_reservation.bed_quantity < this.reservation.bed_quantity)) ||
            (this.temp_reservation.bed_type != undefined && ((this.temp_reservation.bed_type.includes("casal") &&
              !this.reservation.bed_type.includes("casal")) || // casal
            (!this.temp_reservation.bed_type.includes("casal") &&
              this.reservation.bed_type.includes("casal")) ||
            ((this.temp_reservation.bed_type.includes("individual") ||
              this.temp_reservation.bed_type.includes("individuais")) &&
              (!this.reservation.bed_type.includes("individual") ||
                !this.reservation.bed_type.includes("individuais"))) || // individual
            ((!this.temp_reservation.bed_type.includes("individual") ||
              !this.temp_reservation.bed_type.includes("individuais")) &&
              (this.reservation.bed_type.includes("individual") ||
                this.reservation.bed_type.includes("individuais"))))
          )) {
            this.message = this.file.room_change.confirming_changes[
              this.getRandom(this.file.room_change.confirming_changes.length)
            ].replace("{0}", this.getResume());
          } else if(this.temp_reservation.datetime != this.reservation.datetime){
            this.message = this.file.room_change.date_change[
              this.getRandom(this.file.room_change.date_change.length)
            ].replace("{0}", this.formatDate(this.reservation.datetime)).replace("{1}", this.formatDate(this.temp_reservation.datetime));
          } 
          else {
            this.message =
              this.file.room_change.no_changes_identified[
                this.getRandom(this.file.room_change.no_changes_identified.length)
              ];
          }
        }
      }
    } else {
      this.message = this.file.room_change.room_not_reserved_yet;
    }

    return this.message;
  };

  handleReservationCancel = (res, req, entities) => {
    let cookie_room_reservation = this.readCookie(req, "room_reservation");
    console.log(cookie_room_reservation);
    if (cookie_room_reservation && cookie_room_reservation != "undefined") {
      this.reservation = cookie_room_reservation;
      
      if (this.waiting_cancel) {
        let cancel = false;
        for (let key in entities) {
          if (entities[key][0].role == "confirmation") {
            
            if (entities[key][0].value == "true") {
              cancel = true;
            }
  
          }
        }

        if(cancel) {
          this.message = this.file.room_cancel.cancel_success[this.getRandom(this.file.room_cancel.cancel_success.length)];
          this.saveCookie(res, "room_reservation", undefined);
        } else {
          this.message = this.file.room_cancel.cancel_fail[this.getRandom(this.file.room_cancel.cancel_fail.length)];
        }
        this.waiting_cancel = false;
      } else {
        this.message = this.file.room_cancel.cancel_confirmation[this.getRandom(this.file.room_cancel.cancel_confirmation.length)].replace("{0}", this.getResume());
        this.waiting_cancel = true;
      }

    } else {
      this.message = this.file.room_cancel.no_reservation_found[this.getRandom(this.file.room_cancel.no_reservation_found.length)];
    }

    return this.message;
  }

  handleGymAccess = (res, req, entities) => {
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

    if ((gym && price) || price) {
      this.message =
        this.file.gym_access.access_price[
          this.getRandom(this.file.gym_access.access_price.length)
        ];
    } else if ((gym && obj) || obj) {
      this.message =
        this.file.gym_access.gym_machines[
          this.getRandom(this.file.gym_access.gym_machines.length)
        ];
    } else if (gym) {
      this.message =
        this.file.gym_access.gym[
          this.getRandom(this.file.gym_access.gym.length)
        ];
    }

    return this.message;
  };

  handlePoolAccess = (res, req, entities) => {
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

    if ((pool && price) || price) {
      this.message =
        this.file.pool_access.access_price[
          this.getRandom(this.file.pool_access.access_price.length)
        ];
    } else if ((pool && obj) || obj) {
      this.message =
        this.file.pool_access.pool_machines[
          this.getRandom(this.file.pool_access.pool_machines.length)
        ];
    } else if (pool) {
      this.message =
        this.file.pool_access.pool[
          this.getRandom(this.file.pool_access.pool.length)
        ];
    }

    return this.message;
  };

  saveCookie = (res, cookieName, cookieValue) => {
    res.cookie(cookieName, cookieValue);
  };

  readCookie = (req, cookieName) => {
    if (req.cookies) return req.cookies[cookieName];
    else return undefined;
  };

  getRandom = (max) => {
    return Math.floor(Math.random() * max);
  };

  getResume = () => {
    return (
      "<br>" +
      "<ul>" +
      "<li>Números dos quartos:" +
      this.reservation.bed_ids +
      "</li>" +
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
      this.formatDate(this.reservation.datetime) +
      "</li>" +
      "<li>Preço: " +
      this.reservation.room_quantity *
        (this.reservation.bed_type.includes("casal")
          ? this.couple_bed_price * this.reservation.bed_quantity
          : this.single_bed_price * this.reservation.bed_quantity) +
      " €</li>" +
      "</ul>"
    );
  };

  formatDate = (date) => {
    date = new Date(date);
    return date.getUTCDate() +
    " de " +
    monthNames[date.getUTCMonth()] +
    " de " +
    date.getFullYear();
  }

};
