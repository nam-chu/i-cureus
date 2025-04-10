function getDiet(val) {
    let diet = ['', 'omnivore', 'flexitarian', 'vegetarian', 'vegan'];
    let choice = extractSelectedChoices(val);
    return diet[choice];
}

function getNbFlights(valNbFlightsTotal, valNbFlights) {
    let totalChoice = extractSelectedChoices(valNbFlightsTotal); // 0 if no, 1 if yes
    return (totalChoice != 0) ? parseInt(valNbFlights) : 0;
}

function getOwnsCar(val) {
    let choices = extractSelectedChoices(val, true); // extract the selected choices from the string (as array)
    return choices[0] == 1;
}

function getCarAccess(val) {
    return extractSelectedChoices(val) == 1;
}

function getFuelType(val) {
    let fuels = ['', 'petrol', 'diesel', 'bev', 'phev'];
    let choice = extractSelectedChoices(val);
    return fuels[choice];
}

function getCarSize(val) {
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
    } 
    return fuelType + "-" + carSize;
}

function getPtKm(valUsesPt, valPtKm) {
    console.log("getPtKm inputs:", valUsesPt, valPtKm);
    let useChoice = extractSelectedChoices(valUsesPt);
    let result = (useChoice != 0) ? parseIntOrZero(valPtKm) : 0; 
    console.log("getPtKm output:", result);
    return result;
}
function getHouseSize(val) {
    let size = parseIntOrZero(val);
    return size < 1 ? 1 : size;
}
function getHouseType(val) {
    // 1-based index (1,2,3)
    let type = ['', 'flat', 'detached', 'semi-detached'];
    let choice = extractSelectedChoices(val);
    return type[choice];
}
function getResidenceStandard(val) {
    // 1-based index (1,2,3,4)
    let standard = ['', 'old', 'renovated', 'new', 'minergie'];
    let choice = extractSelectedChoices(val);
    return standard[choice];
}
function getHeatingType(val) {
    // 1-based index (1,2,3,4,5,6,7)
    let heating = ['', 'oil', 'electric', "wood", "gas", "heat-pump", "district-heating", "unknown"]
    let choice = extractSelectedChoices(val);
    return heating[choice];
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
    // Trim the answer to remove extra whitespace
    let trimmed = answer ? answer.trim() : "";
    let parsed = parseInt(trimmed);
    return isNaN(parsed) ? 0 : parsed;
}

function formatSurveySettings(data) {

    var surveySettings = {
        hasAccessToCar: getCarAccess(data.q1),
        ownsCar: getOwnsCar(data.q2),
        car: getCar(data.q3, data.q4),
        carKilometrageYearly: parseIntOrZero(data.q5),
        trainKilometrageWeekly: getPtKm(data.q6, data.q7),
        tramKilometrageWeekly: 0,
        busKilometrageWeekly: 0,
        numShortFlights: getNbFlights(data.q8, data.q9),
        numMediumFlights: getNbFlights(data.q8, data.q10),
        numLongFlights: getNbFlights(data.q8, data.q11),
        diet: getDiet(data.q12),
        houseType: getHouseType(data.q13),      // flat, detached, semi-detached
        houseStandard: getResidenceStandard(data.q14),     // old, renovated, new, minergie
        houseSize: getHouseSize(data.q15),
        heatingType: getHeatingType(data.q16),             // oil, gas, electric, heat-pump, wood
    };

    return surveySettings;
}

