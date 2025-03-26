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
        diet: getDiet(data.q1),
        numShortFlights: getNbFlights(data.q2, data.q3),
        numMediumFlights: getNbFlights(data.q2, data.q4),
        numLongFlights: getNbFlights(data.q2, data.q5),
        hasAccessToCar: getCarAccess(data.q6),
        ownsCar: getOwnsCar(data.q7),
        carKilometrageYearly: parseIntOrZero(data.q10),
        car: getCar(data.q8, data.q9),
        trainKilometrageWeekly: getPtKm(data.q11, data.q12),
        tramKilometrageWeekly: 0,
        busKilometrageWeekly: 0,
        houseType: getHouseType(data.q13),      // flat, detached, semi-detached
        houseStandard: getResidenceStandard(data.q14),     // old, renovated, new, minergie
        houseSize: getHouseSize(data.q15),
        heatingType: getHeatingType(data.q16),             // oil, gas, electric, heat-pump, wood
    };

    return surveySettings;
}

