
function getDiet(val) {
    // 1-based index (1,2,3,4)
    let diet = ['', 'omnivore', 'flexitarian', 'vegetarian', 'vegan'];
    let choice = extractSelectedChoices(val);
    return diet[choice];
}

function getNbFlights(valNbFlightsTotal, valNbFlights) {
    let totalChoice = extractSelectedChoices(valNbFlightsTotal); // 0 if no, 1 if yes
    return (totalChoice != 0) ? parseInt(valNbFlights) : 0;
}

function extractSelectedChoices(answer, forceReturnArray = false) {
    let NO_ANSWER = 0;
    var indices = [];
    if (answer == "") {
        indices.push(NO_ANSWER);
    } else {
        while(answer.includes(",")) {
            // read number
            indices.push(parseInt(answer.charAt(0)));
            // delete the read number and ", "
            answer = answer.substring(3);
        }
        // last one
        indices.push(parseInt(answer.charAt(0)));
    }

    if (indices.length == 1 && !forceReturnArray) {
        return indices[0];
    } else {
        return indices;
    }
}

function parseIntOrZero(answer) {
    let parsed = parseInt(answer);
    return isNaN(parsed) ? 0 : parsed;
}



function formatSurveySettings(data) {

    var surveySettings = {
        diet: getDiet(data.q1), 
        numShortFlights: getNbFlights(data.q2, data.q3)
    };

    return surveySettings;
}
