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

function getOwnsCar(val) {
    // string with selected values (1,2,3,4,5,6)
    let choices = extractSelectedChoices(val, true); // extract the selected choices from the string (as array)
    return choices[0] == 1;
}

function getCarAccess(val) {
    // string with selected values (1,2)
    return extractSelectedChoices(val) == 1;
}

function getFuelType(val) {
    // 1-based index (1,2,3,4)
    let fuels = ['', 'petrol', 'diesel', 'bev', 'phev'];
    let choice = extractSelectedChoices(val);
    return fuels[choice];
}

function getCarSize(val) {
    // 1-based index (1,2,3)
    let size = ['', 'small', 'medium', 'large'];
    let choice = extractSelectedChoices(val);
    return size[choice];
}

function getCar(valFuel, valSize) {
    let fuelType = getFuelType(valFuel);
    let carSize = getCarSize(valSize);
    getFuelType(valFuel) + "-" + getCarSize(valSize);
    if(fuelType == '' && carSize == '') {
        return "";
    } else {
        // recode some values that do not exist in CH
        if (fuelType == "diesel" && carSize == "small") {
            carSize = "medium";
        }
        if (fuelType == "phev" && carSize == "small") {
            carSize = "medium";
        }
        return fuelType + "-" + carSize;
    }
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
        numShortFlights: getNbFlights(data.q2, data.q3),
        numMediumFlights: getNbFlights(data.q2, data.q4),
        numLongFlights: getNbFlights(data.q2, data.q5),
        hasAccessToCar: getCarAccess(data.q6),
        ownsCar: getOwnsCar(data.q7),
        carKilometrageYearly: parseIntOrZero(data.q8),
        car: getCar(data.q9, data.q10), // petrol-small, petrol-medium, petrol-large, diesel-medium, diesel-large, phev-medium, phev-large, bev-small, bev-medium, bev-large
    };

    return surveySettings;
}

