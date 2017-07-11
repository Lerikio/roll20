// A Custom script to roll fate dice AND display the result in pretty boxes
// depending on the Fate scale and adjectives.

function fateRollTemplate(adjective, total, roll, bonus, who, approach){
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
  if (parseInt(roll) == -4){
    message = message + " {{fumble=1}}";
  } else if (parseInt(roll) == 4){
    message = message + " {{critical=1}}";
  }
  return message;
};

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

on("chat:message", function(msg) {
  if(msg.type == "api" && msg.content.indexOf("!fate ") !== -1) {
    var parameters = msg.content.replace("!fate ", "").split(" ");
    var bonus = parameters[0];
    if (parameters.length == 2){
      var approach = parameters[1];
    } else {
      var approach = null;
    }
    if(bonus.indexOf("+") == -1 && bonus.indexOf("-") == -1){
        bonus = "+" + bonus;
    }
    sendChat(msg.who, "/roll 4dF", function (ops) {
        var roll = JSON.parse(ops[0].content).total;
        var total = parseInt(roll) + parseInt(bonus)

        if (total < -2){
          sendChat(msg.who, fateRollTemplate(fateAdjectives["-3"], total, roll, bonus, msg.who, approach));
        } else if (total > 8) {
          sendChat(msg.who, fateRollTemplate(fateAdjectives["9"], total, roll, bonus, msg.who, approach));
        } else {
          sendChat(msg.who, fateRollTemplate(fateAdjectives[total], total, roll, bonus, msg.who, approach));
        }
    });
  }
});
