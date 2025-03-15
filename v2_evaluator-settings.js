/* ---------------------------------------------------------------------*/
/* 
    Transform Qualtrics data to PE settings 
*/
/* ---------------------------------------------------------------------*/

// function getLocale(val) {
//     // string language code 
//     switch (val) {
//         case 'de':
//             return 'de-CH';
//         case 'fr':
//             return 'fr-CH';
//         case 'it':
//             return 'it-CH';
//         case 'en':
//             return 'en-US';
//         default:
//             return 'de-CH';
//     }
// }

// function getOwnsCar(val) {
//     // string with selected values (1,2,3,4,5,6)
//     let choices = extractSelectedChoices(val, true); // extract the selected choices from the string (as array)
//     return choices[0] == 1;
// }

// function getCarAccess(val) {
//     // string with selected values (1,2)
//     return extractSelectedChoices(val) == 1;
// }

// function getFuelType(val) {
//     // 1-based index (1,2,3,4)
//     let fuels = ['', 'petrol', 'diesel', 'bev', 'phev'];
//     let choice = extractSelectedChoices(val);
//     return fuels[choice];
// }

// function getCarSize(val) {
//     // 1-based index (1,2,3)
//     let size = ['', 'small', 'medium', 'large'];
//     let choice = extractSelectedChoices(val);
//     return size[choice];
// }

// function getCar(valFuel, valSize) {
//     let fuelType = getFuelType(valFuel);
//     let carSize = getCarSize(valSize);
//     getFuelType(valFuel) + "-" + getCarSize(valSize);
//     if(fuelType == '' && carSize == '') {
//         return "";
//     } else {
//         // recode some values that do not exist in CH
//         if (fuelType == "diesel" && carSize == "small") {
//             carSize = "medium";
//         }
//         if (fuelType == "phev" && carSize == "small") {
//             carSize = "medium";
//         }
//         return fuelType + "-" + carSize;
//     }
// }

// function getTicketType(val) {
//     // ignores seven25 and point to point travelcard
//     let choices = extractSelectedChoices(val, true);
//     if (choices.includes(1)) {
//         return "season";
//     } else if (choices.includes(2) && choices.includes(3)) {
//         return "region-and-half-fare";
//     } else if (choices.includes(2)) {
//         return "half-fare";
//     } else if (choices.includes(3)) {
//         return "region";
//     } else {
//         return "none";
//     }
// }

// function getPtKm(valUsesPt, valPtKm) {
//     let useChoice = extractSelectedChoices(valUsesPt);
//     return (useChoice != 0) ? parseInt(valPtKm) : 0; 
// }

// function getNbFlights(valNbFlightsTotal, valNbFlights) {
//     let totalChoice = extractSelectedChoices(valNbFlightsTotal); // 0 if no, 1 if yes
//     return (totalChoice != 0) ? parseInt(valNbFlights) : 0;
// }

// function usesBike(val) {
//     let choice = extractSelectedChoices(val);
//     return choice != 6;
// }

// function getHasBike(valUsesBike, valBikeKm) {
//     return getBikeKm(valUsesBike,valBikeKm) > 0;
// }

// function getHasEBike(valUsesBike, valEBikeKm) {
//     return getEBikeKm(valUsesBike, valEBikeKm) > 0;
// }

// function getBikeKm(valUsesBike, valBikeKm) {
//     return usesBike(valUsesBike) ? parseInt(valBikeKm) : 0;
// }

// function getEBikeKm(valUsesBike, valEBikeKm) {
//     return usesBike(valUsesBike) ? parseInt(valEBikeKm) : 0;
// }

function getDiet(val) {
    // 1-based index (1,2,3,4)
    let diet = ['', 'omnivore', 'flexitarian', 'vegetarian', 'vegan'];
    let choice = extractSelectedChoices(val);
    return diet[choice];
}

// function getHouseOwner(val) {
//     let choice = extractSelectedChoices(val);
//     return choice == 1;
// }

// function getHouseSize(val) {
//     let size = parseIntOrZero(val);
//     return size < 1 ? 1 : size;
// }

// function getHouseType(val) {
//     // 1-based index (1,2,3)
//     let type = ['', 'flat', 'detached', 'semi-detached'];
//     let choice = extractSelectedChoices(val);
//     return type[choice];
// }

// function getResidenceStandard(val) {
//     // 1-based index (1,2,3,4)
//     let standard = ['', 'old', 'renovated', 'new', 'minergie'];
//     let choice = extractSelectedChoices(val);
//     return standard[choice];
// }

// function getHeatingType(val) {
//     // 1-based index (1,2,3,4,5,6,7)
//     let heating = ['', 'oil', 'electric', "wood", "gas", "heat-pump", "district-heating", "unknown"]
//     let choice = extractSelectedChoices(val);
//     return heating[choice];
// }

// function getHasSolarPanels(val) {
//     // 0-based index (0, 1)
//     let choice = extractSelectedChoices(val);
//     return choice == 1;
// }

/**
 * Taking the string from Qualtrics, returns an array containing the indices of all selected answers (or an int if only 1 answer).
 * The function only works with at most 10 options.
 * @param {str} answer : The string returned by default qualtrics option. '${q://QIDx/SelectedChoicesRecode}'
 * @param {boolean} (optional, default false) forceReturnArray : If true, always returns an array (even if only 1 element)
 * @returns {array<int> or int} : array if more than one option selected
 */
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

/* ---------------------------------------------------------------------*/
/* Transform */

function formatSurveySettings(data) {

    var surveySettings = {
        // language: data.lang.toLowerCase(),
        // locale: getLocale(data.lang.toLowerCase()),
        // hasAccessToCar: getCarAccess(data.q1a),
        // ownsCar: getOwnsCar(data.q1b),
        // carKilometrageYearly: parseIntOrZero(data.q5),
        // car: getCar(data.q2, data.q3), // petrol-small, petrol-medium, petrol-large, diesel-medium, diesel-large, phev-medium, phev-large, bev-small, bev-medium, bev-large
        // carValue: parseIntOrZero(data.q4),
        // trainKilometrageWeekly: getPtKm(data.q6, data.q7),
        // tramKilometrageWeekly: 0,
        // busKilometrageWeekly: 0,
        // ptTicket: getTicketType(data.q8, true), // none, region, half-fare, region-and-half-fare, season
        // numShortFlights: getNbFlights(data.q9, data.q10),
        // numMediumFlights: getNbFlights(data.q9, data.q11),
        // numLongFlights: getNbFlights(data.q9, data.q12),
        // hasBike: getHasBike(data.q13, data.q14),
        // hasEBike: getHasEBike(data.q13, data.q15),
        // kilometrageBike: getBikeKm(data.q13, data.q14),
        // kilometrageEBike: getEBikeKm(data.q13, data.q15),
        diet: getDiet(data.q17),        // omnivore, flexitarian, vegetarian, vegan
        // ownsHouse: getHouseOwner(data.q18),
        // houseType: getHouseType(data.q19),      // flat, detached, semi-detached
        // houseStandard: getResidenceStandard(data.q20),     // old, renovated, new, minergie
        // heatingType: getHeatingType(data.q23),             // oil, gas, electric, heat-pump, wood
        // houseSize: getHouseSize(data.q22),
        // householdMembers: parseIntOrZero(data.q21),
        // hasSolarPanels: getHasSolarPanels(data.q24),
        // co2CertificateBasePrice: parseInt(data.certificatePrice),
        // hiddenTextSelector: data.hiddenTextSelector,
        // reductionTarget: 0.7            // i.e. target is to reduce consumption to 70%
    };

    return surveySettings;
}

// function setTargetReached(selector) {
//     // Set target reached in hidden input box
//     // Needs to be called from evaluator.js    

//     if (jQuery(selector).length > 0) {
//         jQuery(selector).val('target-reached')
//     }
// }

// function unsetTargetReached(selector) {
//     // Undo the step done by set target reached

//     if (jQuery(selector).length > 0) {
//         jQuery(selector).val('')
//     }
// }

/* ---------------------------------------------------------------------*/
/* Testing */


function getSurveyData() {

    // This is just for testing a given data object transform
    var qData = {
        lang: "DE",
        q1a: "1",
        q1b: "1",
        q2: "1",
        q3: "1",
        q4: "2000",
        q5: "1000",
        q6: "3",
        q7: "400",
        q8: "1",
        q9: "1",
        q10: "0",
        q11: "2",
        q12: "0",
        q13: "2",
        q14: "6",
        q15: "0",
        q16: "0",
        q17: "1",
        q18: "0",
        q19: "1",
        q20: "1",
        q21: "2",
        q22: "86",
        q23: "1",
        q24: "0",
        certificatePrice : '50',
        version: "test"
    }

    return qData;
}


/* ---------------------------------------------------------------------*/
