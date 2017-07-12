// A Custom script to roll fate dice AND display the result in pretty boxes
// depending on the Fate scale and adjectives.

function fateRollTemplate(adjective, total, roll, bonus, who, approach, color){
  var message = "";
  if(approach !== null){
    message = "&{template:5eInspired} {{title=" + adjective +
              "}} {{subheader=" + who + "}} {{subheaderright=" + approach +
              "}} {{result=" + total +
              "}} {{roll=" + roll +
              "}} {{bonus=" + bonus + "}}";
  } else {
    message = "&{template:5eInspired} {{title=" + adjective +
              "}} {{subheader=" + who +
              "}} {{result=" + total +
              "}} {{roll=" + roll +
              "}} {{bonus=" + bonus + "}}";
  }
  message = message + " {{color=" + color + "}}";
  if (parseInt(roll) == -4){
    message = message + " {{fumble=1}}";
  } else if (parseInt(roll) == 4){
    message = message + " {{critical=1}}";
  }
  return message;
};

function fateSecretTemplate(message, who, color){
  var message = "&{template:5eInspired} {{title=Jet secret}} {{subheader=" +
                 who + "}} {{color=" + color + "}} {{message=" + message + "}}";
  return message;
}

var fateAdjectives = {"-3" : "Ouch...",
                      "-2" : "Atroce",
                      "-1" : "Mauvais",
                       "0" : "Médiocre",
                       "1" : "Moyen",
                       "2" : "Passable",
                       "3" : "Bon",
                       "4" : "Excellent",
                       "5" : "Formidable",
                       "6" : "Fantastique",
                       "7" : "Epique",
                       "8" : "Légendaire",
                       "9" : "Incroyable !"}

// For secret dice roll: whisper roll to GM and notify all that the roll has been made
// Use: !fsr <modifier> <character name>
on("chat:message", function(msg) {
  if(msg.type == "api" && msg.content.indexOf("!fsr ") !== -1) {
    var color = getObj("player", msg.playerid).color;
    var parameters = msg.content.replace("!fsr ", "").split(" ");
    var bonus = parameters[0];
    if (parameters.length >= 2){
      var character = parameters[1];
    } else {
      var character = msg.who;
    }
    if(bonus.indexOf("+") == -1 && bonus.indexOf("-") == -1){
        bonus = "+" + bonus;
    }
    sendChat("System", "/roll 4dF", function (ops) {
        var roll = JSON.parse(ops[0].content).total;
        var total = parseInt(roll) + parseInt(bonus);
        if (total < -2){
          sendChat("System", "/w gm " + fateRollTemplate(fateAdjectives["-3"], total, roll, bonus, character, null, color));
        } else if (total > 8) {
          sendChat("System", "/w gm " + fateRollTemplate(fateAdjectives["9"], total, roll, bonus, character, null, color));
        } else {
          sendChat("System", "/w gm " + fateRollTemplate(fateAdjectives[total], total, roll, bonus, character, null, color));
        }
    });
    sendChat(msg.who, fateSecretTemplate("Résultat envoyé au MJ", character, color));
  }
});

// Normal, for all to see roll.
// Use: !fr <modifier> <character name> <approach>
on("chat:message", function(msg) {
  if(msg.type == "api" && msg.content.indexOf("!fr ") !== -1) {
    log(msg.playerid);
    log(getObj("player", msg.playerid));
    log(getObj("player", msg.playerid)["color"]);
    var color = getObj("player", msg.playerid)["color"];
    var parameters = msg.content.replace("!fr ", "").split(" ");
    var bonus = parameters[0];
    if (parameters.length == 3){
      var approach = parameters[2];
    } else {
      var approach = null;
    }
    if (parameters.length >= 2){
      var character = parameters[1];
    } else {
      var character = msg.who;
    }
    if(bonus.indexOf("+") == -1 && bonus.indexOf("-") == -1){
        bonus = "+" + bonus;
    }
    sendChat(msg.who, "/roll 4dF", function (ops) {
        var roll = JSON.parse(ops[0].content).total;
        var total = parseInt(roll) + parseInt(bonus)

        if (total < -2){
          sendChat(msg.who, fateRollTemplate(fateAdjectives["-3"], total, roll, bonus, character, approach, color));
        } else if (total > 8) {
          sendChat(msg.who, fateRollTemplate(fateAdjectives["9"], total, roll, bonus, character, approach, color));
        } else {
          sendChat(msg.who, fateRollTemplate(fateAdjectives[total], total, roll, bonus, character, approach, color));
        }
    });
  }
});
