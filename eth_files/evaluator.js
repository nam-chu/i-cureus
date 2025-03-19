 /**
 *  Priority Evaluator
 *  A responsive tool to modify and reduce your climate footprint 
 *  
 *  This version is developed for a survey by the Swiss Mobility Panel at ETH Zurich.
 * 
 *  Author: Christoph Dobler
 *  Co-Author / Adaptations to Qualtrics: Jan Linder
 *  Date: March 2022
 * 
 */


/*
 * -----------------------------------------
 * Configure calculation parameter
 * -----------------------------------------
 */
const dietParameter = new Map([
    ["omnivore", 1.837],
    ["flexitarian", 1.495],
    ["vegetarian", 1.380],
    ["vegan", 1.124]
]);

const fuelParameter = new Map([
    ["petrol", 1.53],
    ["diesel", 1.54],
    ["phev", 0.21],
    ["bev", 0.21],
]);

const carParameter = new Map([
    ["petrol-small", new Map([
        ["co2", 235],
        ["fuel-consumption", 6.5],
        ["electricity-consumption", 0.0],
        ["price", 17500],
        ["fuel-price", fuelParameter.get("petrol")],
        ["electricity-price", 0.0],
        ])
    ],
    ["petrol-medium", new Map([
        ["co2", 245],
        ["fuel-consumption", 7.1],
        ["electricity-consumption", 0.0],
        ["price", 20000],
        ["fuel-price", fuelParameter.get("petrol")],
        ["electricity-price", 0.0],
        ])
    ],
    ["petrol-large", new Map([
        ["co2", 270],
        ["fuel-consumption", 7.9],
        ["electricity-consumption", 0.0],
        ["price", 33000],
        ["fuel-price", fuelParameter.get("petrol")],
        ["electricity-price", 0.0],
        ])
    ],
    ["diesel-medium", new Map([
        ["co2", 245],
        ["fuel-consumption", 5.9],
        ["electricity-consumption", 0.0],
        ["price", 40000],
        ["fuel-price", fuelParameter.get("diesel")],
        ["electricity-price", 0.0],
        ])
    ],
    ["diesel-large", new Map([
        ["co2", 285],
        ["fuel-consumption", 7.2],
        ["electricity-consumption", 0.0],
        ["price", 45000],
        ["fuel-price", fuelParameter.get("diesel")],
        ["electricity-price", 0.0],
        ])
    ],
    ["phev-medium", new Map([
        ["co2", 180],
        ["fuel-consumption", 4.1],
        ["electricity-consumption", 12.1],
        ["price", 49000],
        ["fuel-price", fuelParameter.get("petrol")],
        ["electricity-price", fuelParameter.get("phev")],
        ])
    ],
    ["phev-large", new Map([
        ["co2", 270],
        ["fuel-consumption", 4.0],
        ["electricity-consumption", 14.8],
        ["price", 64000],
        ["fuel-price", fuelParameter.get("petrol")],
        ["electricity-price", fuelParameter.get("phev")],
        ])
    ],
    ["bev-small", new Map([
       ["co2", 50],
       ["fuel-consumption", 0.0],
       ["electricity-consumption", 19.9],
       ["price", 37000],
       ["fuel-price", 0.0],
       ["electricity-price", fuelParameter.get("bev")],
       ])
    ],
    ["bev-medium", new Map([
       ["co2", 50],
       ["fuel-consumption", 0.0],
       ["electricity-consumption", 20.9],
       ["price", 33000],
       ["fuel-price", 0.0],
       ["electricity-price", fuelParameter.get("bev")],
       ])
    ],
    ["bev-large", new Map([
       ["co2", 55],
       ["fuel-consumption", 0.0],
       ["electricity-consumption", 21.9],
       ["price", 43000],
       ["fuel-price", 0.0],
       ["electricity-price", fuelParameter.get("bev")],
       ])
   ]
]);

const ptParameter = new Map([
    ["train", 0.08 ],
    ["tram", 0.08 ],
    ["bus", 0.08 ],
//     ["compensationShort", 0.08]
    ["compensationShort", 0.08],
    ["compensationLong", 0.08]
]);

const ptTicketParameter = new Map([
    ["none", 0 ],
    ["region", 800 ],
    ["half-fare", 180 ],
    ["region-and-half-fare", 980 ],
    ["season", 3860 ]
]);

const bikeParameter = new Map([
    ["bike", new Map([
        ["co2", 17],
        ["price", 800]
        ])
    ],
    ["ebike", new Map([
        ["co2", 34],
        ["price", 3000]
        ])
    ]
]);

const flightParameter = new Map([
    ["short", new Map([
        ["co2", 0.5],
        ["price", -200]
        ])
    ],
    ["medium", new Map([
        ["co2", 2],
        ["price", -400]
        ])
    ],
    ["long", new Map([
        ["co2", 7],
        ["price", -1200]
        ])
    ]
]);

const heatingTypeParameter = new Map([
    ["oil", 2.65],
    ["gas", 2.25],
    ["electric", 1.28],
    ["heat-pump", 1.28],
    ["wood", 0.01],
    ["district-heating", 0.01],
    ["unknown", 2.65]
]);

const heatingCostsPerUnit = new Map([
    ["oil", 0.087],
    ["gas", 0.091],
    ["electric", 0.21],
    ["heat-pump", 0.21],
    ["wood", 0.08],
    ["district-heating", 0.1],
    ["unknown", 0.21]
]);

const heatingEfficiency = new Map([
    ["oil", 0.80],
    ["gas", 0.90],
    ["electric", 1.00],
    ["heat-pump", 3.00],
    ["wood", 0.85],
    ["district-heating", 1.0],
    ["unknown", 1.00]
]);

const houseStandardParameter = new Map([
    ["old", 120],
    ["renovated", 60],
    ["new", 40],
    ["minergie", 20]
]);

const houseReductionParameter = new Map([
    ["insulateRoof", new Map([
        ["factor", 0.21],
        ["price", new Map([
            ["detached", 70000],
            ["semi-detached", 35000]
            ])
        ]
        ])
    ],
    ["insulateFacade", new Map([
        ["factor", 0.30],
        ["price", new Map([
            ["detached", 68750],
            ["semi-detached", 49500]
            ])
        ]
        ])
    ],
    ["replaceWindows", new Map([
        ["factor", 0.15],
        ["price", new Map([
            ["detached", 16800],
            ["semi-detached", 12000]
            ])
        ]
        ])
    ],
    ["solarPanels", new Map([
        ["factor", 0.12],
        ["price", new Map([
            ["detached", 21000],
            ["semi-detached", 21000]
            ])
        ]
        ])
    ],
    ["ventilationSystem", new Map([
        ["factor", 0.12],
        ["price", new Map([
            ["detached", 18000],
            ["semi-detached", 18000]
            ])
        ]
        ])
    ],
    ["heatPump", new Map([
        ["factor", 0.66],
        ["price", new Map([
            ["detached", 35000],
            ["semi-detached", 35000]
            ])
        ]
        ])
    ],
    ["temperatureReduction", new Map([
        ["factor", 0.05],
        ["price", new Map([
            ["detached", 0],
            ["semi-detached", 0]
            ])
        ]
        ])
    ],
]);

/*
 * -----------------------------------------
 */

/*
 * -----------------------------------------
 * Define multi-lingual texts here.
 * -----------------------------------------
 */
var texts = {
    de: {
        table: {
            header: {
                selected: "",
                measure: "Massnahme",
                parameter: "Ausprägung",
                cost: "Kosten (-) /",
                cost2: "Einsparungen (+)",
                cost3investment: "einmalig",
                cost3annual: "jährlich"
            },
            body: {
                reduceKilometrageCar: "Fahrleistung Auto reduzieren um",
                compensateKilometrageCarByNone: "keine Kompensation",
                compensateKilometrageCarByPtShort: "Kompensation mit ÖV (Nahverkehr)",
                compensateKilometrageCarByPtLong: "Kompensation mit ÖV (Fernverkehr)",
                compensateKilometrageCarByBike: "Kompensation mit Fahrrad",
                compensateKilometrageCarByEBike: "Kompensation mit E-Bike",
                replaceCar: "Auto ersetzen durch",
                replaceCarOptionPetrolSmall: "Benzin, klein (z.B. VW Polo)",
                replaceCarOptionPetrolMedium: "Benzin, mittel (z.b. VW Golf)",
                replaceCarOptionPetrolLarge: "Benzin, gross (z.B. VW Tiguan)",
                replaceCarOptionDieselMedium: "Diesel, mittel (z.B. Skoda Octavia)",
                replaceCarOptionDieselLarge: "Diesel, gross (z.B. VW Tiguan)",
                replaceCarOptionPhevMedium: "Plug-in Hybrid, mittel (z.B. Volvo V60)",
                replaceCarOptionPhevLarge: "Plug-in Hybrid, gross (z.B. Volvo XC60)",
                replaceCarOptionBevSmall: "Electric, klein (z.B. Renault Zoe)",
                replaceCarOptionBevMedium: "Electric, mittel (z.B. VW ID.3)",
                replaceCarOptionBevLarge: "Electric, gross (z.B. Hyundai Kona)",
                replaceCarOptionUnknownOther: "delete this (Weiss nicht, Andere)",
                sellCar: "Auto verkaufen",
                ptTicket: "Kaufe Abo für den öffentlichen Verkehr",
                ptTicketOptionNone: "kein Abonnement",
                ptTicketOptionRegion: "Verbundabo (z.B. ZVV, Ostwind, etc.)",
                ptTicketOptionHalfFare: "Halbtax Abonnement",
                ptTicketOptionRegionAndHalfFare: "Verbundabo und Halbtax Abonnement",
                ptTicketOptionSeason: "General-Abonnement (GA)",
                shortFlights: "Anzahl Kurzstreckenflüge reduzieren um",
                mediumFlights: "Anzahl Mittelstreckenflüge reduzieren um",
                longFlights: "Anzahl Langstreckenflüge reduzieren um",
                diet: "Ernährung",
                dietOptionOmnivore: "Allesesser/in ",
                dietOptionFlexitarian: "flexitarisch",
                dietOptionVegetarian: "vegetarisch",
                dietOptionVegan: "vegan",
                insulateRoof: "Dach dämmen",
                insulateFacade: "Fassade dämmen",
                replaceWindows: "Fenster austauschen",
                solarPanels: "Solaranlage installieren",
                ventilationSystem: "Kontrollierte Lüftung installieren",
                heatPump: "Wärmepumpe installieren",
                temperatureReduction: "Raumtemperatur reduzieren um",
                co2Certificate: "CO2-Zertifikat kaufen",
                sum: "Summe"
            },
            footer: {
                targetReached: "Sie haben Ihr CO2-Ziel erreicht",
                targetNotReached: "Sie haben Ihr CO2-Ziel noch nicht erreicht"
            }
        },
        chart: {
            xAxisLabel: "",
            yAxisLabel: "CO2-Emissionen [t/Jahr]",
            labels: [["Aktuelle", "Emissionen"], ["Emissionen", "nach", "Veränderung"], "Emissionsziel"],
            hoverLabels: ["Aktuelle Emissionen", "Emissionen nach Veränderung", "Emissionsziel"],
            categoryHouseLabel: "Wohnen",
            categoryDietLabel: "Ernährung",
            categoryMobilityLabel: "Mobilität",
            categoryTargetLabel: "Emissionsziel",
            categoryCo2Certificatelabel: "CO2-Zertifikate"
        },
        errorPopUp: {
            errMsg: "Sind Sie sicher, dass Sie mit der Umfrage fortfahren möchten, ohne Ihr persönliches CO2-Emissionsziel erreicht zu haben?",
            buttonContinue: "Weiter",
            buttonCancel: "Zur Aufgabe zurückkehren"
        }
    },
    en: {
        table: {
            header: {
                selected: "",
                measure: "Measure",
                parameter: "Value",
                cost: "Costs (-) /",
                cost2: "Savings (+)",
                cost3investment: "One-time",
                cost3annual: "Annual"
            },
            body: {
                reduceKilometrageCar: "Reduce car mileage",
                compensateKilometrageCarByNone: "No compensation",
                compensateKilometrageCarByPtShort: "Compensate with PT (local transport)",
                compensateKilometrageCarByPtLong: "Compensate with PT (long-distance transport)",
                compensateKilometrageCarByBike: "Compensate with bicylce",
                compensateKilometrageCarByEBike: "Compensate with e-bike",
                replaceCar: "Replace car with",
                replaceCarOptionPetrolSmall: "Petrol, small (e.g. VW Polo)",
                replaceCarOptionPetrolMedium: "Petrol, medium (e.g. VW Golf)",
                replaceCarOptionPetrolLarge: "Petrol, large (e.g. VW Tiguan)",
                replaceCarOptionDieselMedium: "Diesel, medium (e.g. Skoda Octavia)",
                replaceCarOptionDieselLarge: "Diesel, large (e.g. VW Tiguan)",
                replaceCarOptionPhevMedium: "Plug-in Hybrid, medium (e.g. Volvo V60)",
                replaceCarOptionPhevLarge: "Plug-in Hybrid, large (e.g. Volvo XC60)",
                replaceCarOptionBevSmall: "Electric, small (e.g. Renault Zoe)",
                replaceCarOptionBevMedium: "Electric, medium (e.g. VW ID.3)",
                replaceCarOptionBevLarge: "Electric, large (e.g. Hyundai Kona)",
                replaceCarOptionUnknownOther: "delete this (unknown-other)",
                sellCar: "Sell car",
                ptTicket: "Buy public transport pass",
                ptTicketOptionNone: "no Travelcard",
                ptTicketOptionRegion: "Regional Travelcard (e.g. ZVV, Ostwind, etc.)",
                ptTicketOptionHalfFare: "Halbtax Abonnement (Half Fare Travelcard)",
                ptTicketOptionRegionAndHalfFare: "Regional Travelcard & Halbtax Abonnement",
                ptTicketOptionSeason: "General-Abonnement (GA Travelcard)",
                shortFlights: "Reduce number of short-haul flights by",
                mediumFlights: "Reduce number of medium-haul flights by",
                longFlights: "Reduce number of long-haul flights by",
                diet: "Diet",
                dietOptionOmnivore: "Omnivore",
                dietOptionFlexitarian: "Flexitarian",
                dietOptionVegetarian: "Vegetarian",
                dietOptionVegan: "Vegan",
                insulateRoof: "Insulate roof",
                insulateFacade: "Insulate facade",
                replaceWindows: "Replace windows",
                solarPanels: "Install solar panels",
                ventilationSystem: "Install controlled air ventilation",
                heatPump: "Install heat pump",
                temperatureReduction: "Reduce room temperature by",
                co2Certificate: "Buy CO2 certificate",
                sum: "Sum"
            },
            footer: {
                targetReached: "You have reached your CO2 target",
                targetNotReached: "You have not reached your CO2 target"
            }
        },
        chart: {
            xAxisLabel: "",
            yAxisLabel: "CO2 emissions [t/year]",
            labels: [["Current", "Emissions"], ["Emissions", "after changes"], ["Emissions", "Target"]],
            hoverLabels: ["Current Emissions", "Emissions after changes", "Emissions Target"],
            categoryHouseLabel: "Housing",
            categoryDietLabel: "Diet",
            categoryMobilityLabel: "Mobility",
            categoryTargetLabel: "Emissions Target",
            categoryCo2Certificatelabel: "CO2 Certificates"
        },
        errorPopUp: {
            errMsg: "Are you sure that you want to continue without having reached your personal CO2 target?",
            buttonContinue: "Continue",
            buttonCancel: "Go back to the exercise"
        }
    },
    fr: {
        table: {
            header: {
                selected: "",
                measure: "Mesure",
                parameter: "Valeur",
                cost: "Coûts (-) /",
                cost2: "Economies (+)",
                cost3investment: "uniques",
                cost3annual: "annuels"
            },
            body: {
                reduceKilometrageCar: "Moins utiliser la voiture",
                compensateKilometrageCarByNone: "Aucune commpensation",
                compensateKilometrageCarByPtShort: "Compenser par les trans. publ. (transports locaux)",
                compensateKilometrageCarByPtLong: "Compenser par les trans. publ. (longue-distance)",
                compensateKilometrageCarByBike: "Compenser avec un vélo",
                compensateKilometrageCarByEBike: "Compenser avec un vélo électrique ",
                replaceCar: "Remplacer la voiture par",
                replaceCarOptionPetrolSmall: "Essence, petite (ex. VW Polo)",
                replaceCarOptionPetrolMedium: "Essence, moyenne (ex. VW Golf)",
                replaceCarOptionPetrolLarge: "Essence, grande (ex. VW Tiguan)",
                replaceCarOptionDieselMedium: "Diesel, moyenne (ex. Skoda Octavia)",
                replaceCarOptionDieselLarge: "Diesel, grande (ex. VW Tiguan)",
                replaceCarOptionPhevMedium: "Plug-in Hybrid, moyenne (ex. Volvo V60)",
                replaceCarOptionPhevLarge: "Plug-in Hybrid, grande (ex. Volvo XC60)",
                replaceCarOptionBevSmall: "Électrique, petite (ex. Renault Zoe)",
                replaceCarOptionBevMedium: "Électrique, moyenne (ex. VW ID.3)",
                replaceCarOptionBevLarge: "Électrique, grande (ex. Hyundai Kona)",
                replaceCarOptionUnknownOther: "delete this (unknown other)",
                sellCar: "Vendre la voiture",
                ptTicket: "Acheter un abonnement de trans. publ.",
                ptTicketOptionNone: "pas de abonnement ",
                ptTicketOptionRegion: "Abonnement régional (ex. TL, TPG, etc.)",
                ptTicketOptionHalfFare: "Abonnement demi-tarif",
                ptTicketOptionRegionAndHalfFare: "Abonnement régional + demi-tarif",
                ptTicketOptionSeason: "Abonnement général (GA Travelcard)",
                shortFlights: "Réduire le nombre de vols court-courriers de",
                mediumFlights: "Réduire le nombre de vols moyen-courriers de",
                longFlights: "Réduire le nombre de vols long-courriers de",
                diet: "Régime alimentaire",
                dietOptionOmnivore: "Omnivore",
                dietOptionFlexitarian: "Flexitarien",
                dietOptionVegetarian: "Végétarien",
                dietOptionVegan: "Végane",
                insulateRoof: "Isolation du toit",
                insulateFacade: "Isolation de la façade",
                replaceWindows: "Remplacement des fenêtres",
                solarPanels: "Installation de panneaux solaires",
                ventilationSystem: "Installation d'une ventilation à air contrôlé",
                heatPump: "Installation d'une pompe à chaleur",
                temperatureReduction: "Réduire la température de la pièce de",
                co2Certificate: "Acheter un certificat CO2",
                sum: "Somme"
            },
            footer: {
                targetReached: "Vous avez atteint votre objectif de CO2",
                targetNotReached: "Vous n'avez pas atteint votre objectif de CO2"
            }
        },
        chart: {
            xAxisLabel: "",
            yAxisLabel: "Émissions de CO2 [t/an]",
            labels: [["Émissions", "actuelles"], ["Émissions", "après", "modifications"], ["Objectif", "d'émissions"]],
            hoverLabels: ["Émissions actuelles", "Émissions après modifications", "Objectif d'émissions"],
            categoryHouseLabel: "Logement",
            categoryDietLabel: "Régime alimentaire",
            categoryMobilityLabel: "Mobilité",
            categoryTargetLabel: "Objectif d'émissions",
            categoryCo2Certificatelabel: "Certificat CO2"
        },
        errorPopUp: {
            errMsg: "Êtes-vous certain de vouloir continuer l'enquête sans avoir atteint votre objectif personnel d'émissions CO2 ?",
            buttonContinue: "Continuer",
            buttonCancel: "Retourner à l'exercise"
        }
    },
    it: {
        table: {
            header: {
                selected: "",
                measure: "Misura",
                parameter: "Valore",
                cost: "Costi (-) /",
                cost2: "Risparmi (+)",
                cost3investment: "una tantum",
                cost3annual: "ann."
            },
            body: {
                reduceKilometrageCar: "Usare meno l'auto",
                compensateKilometrageCarByNone: "Nessun compenso",
                compensateKilometrageCarByPtShort: "Compensare con trasporto pubbl. (locale)",
                compensateKilometrageCarByPtLong: "Compensare con trasporto pubbl. (lunga distanza)",
                compensateKilometrageCarByBike: "Compensare con una bicicletta",
                compensateKilometrageCarByEBike: "Compensare con una bicicletta elettrica",
                replaceCar: "Sostituire auto con",
                replaceCarOptionPetrolSmall: "Benzina, piccola (es. VW Polo)",
                replaceCarOptionPetrolMedium: "Benzina, media (es. VW Golf)",
                replaceCarOptionPetrolLarge: "Benzina, grande (es. VW Tiguan)",
                replaceCarOptionDieselMedium: "Diesel, media (es. Skoda Octavia)",
                replaceCarOptionDieselLarge: "Diesel, grande (es. VW Tiguan)",
                replaceCarOptionPhevMedium: "Plug-in Hybrid, media (es. Volvo V60)",
                replaceCarOptionPhevLarge: "Plug-in Hybrid, grande (es. Volvo XC60)",
                replaceCarOptionBevSmall: "Elettrico, piccolo (es. Renault Zoe)",
                replaceCarOptionBevMedium: "Elettrico, media (es. VW ID.3)",
                replaceCarOptionBevLarge: "Elettrico, grande (es. Hyundai Kona)",
                replaceCarOptionUnknownOther: "delete this option (unknown-other)",
                sellCar: "Vendere l'auto",
                ptTicket: "Acquistare abbonamento per i mezzi pubblici",
                ptTicketOptionNone: "nessun abbonamento",
                ptTicketOptionRegion: "Abbonam. di communita (es. Arcobaleno, ecc.)",
                ptTicketOptionHalfFare: "Abbonamento metà-prezzo",
                ptTicketOptionRegionAndHalfFare: "Abbonam. di communita + metà-prezzo",
                ptTicketOptionSeason: "Abbonamento generale",
                shortFlights: "Ridurre il numero di voli a corto raggio di",
                mediumFlights: "Ridurre il numero di voli a medio raggio di",
                longFlights: "Ridurre il numero di voli a lungo raggio di",
                diet: "Dieta",
                dietOptionOmnivore: "Onnivora",
                dietOptionFlexitarian: "Flexitariana",
                dietOptionVegetarian: "Vegetariana",
                dietOptionVegan: "Vegana",
                insulateRoof: "Isolare il tetto",
                insulateFacade: "Isolare la facciata",
                replaceWindows: "Sostituire le finestre",
                solarPanels: "Installare pannelli solari",
                ventilationSystem: "Installare una ventilazione controllata dell'aria",
                heatPump: "Installare una pompa di calore",
                temperatureReduction: "Ridurre la temperatura della stanza di",
                co2Certificate: "Acquistare un certificato di CO2",
                sum: "Somma"
            },
            footer: {
                targetReached: "Avete raggiunto il vostro obiettivo di CO2",
                targetNotReached: "Non avete raggiunto il vostro obiettivo di CO2"
            }
        },
        chart: {
            xAxisLabel: "",
            yAxisLabel: "Emissioni di CO2 [t/anno]",
            labels: [["Emissioni", "attuali"], ["Emissioni", "dopo le", "modifiche"], ["Target di", "emissioni"]],
            hoverLabels: ["Emissioni attuali", "Emissioni dopo le modifiche", "Target di emissioni"],
            categoryHouseLabel: "Allogio",
            categoryDietLabel: "Dieta",
            categoryMobilityLabel: "Mobilità",
            categoryTargetLabel: "Target di emissioni",
            categoryCo2Certificatelabel: "Certificato di CO2"
        },
        errorPopUp: {
            errMsg: "Siete sicuri di voler continuare l'indagine senza aver raggiunto il vostro obiettivo personale di emissioni di CO2?",
            buttonContinue: "Continuare",
            buttonCancel: "Ritornare al esercizio"
        }
    },
}
/*
 * -----------------------------------------
 */

// define some variable globally
var evaluatorSettings = {
    initialized: false
};

var target_dataset = ['0', '0', '0'];

var house_dataset = ['0', '0', '0'];
var diet_dataset = ['0', '0', '0'];
var mobility_dataset = ['0', '0', '0'];
let nbDecimals = 1; // displayed data is rounded to this nb of decimals

var ctx; // cannot be given value before we are on right page
var chart;

// just for testing when running as individual application
function init() {
    // input settings from survey - to be transformed to evaluatorSettings
    var surveySettings = {
        enableDebug: false,

        language: "de", // de, fr, it, en
        locale: "de-CH",

        hasAccessToCar: true,
        ownsCar: true,
        carKilometrageYearly: 15000,
        car: "petrol-medium", // petrol-small, petrol-medium, petrol-large, diesel-medium, diesel-large, phev-medium, phev-large, bev-small, bev-medium, bev-large
        carValue: 10000,

        trainKilometrageWeekly: 500,
        tramKilometrageWeekly: 25,
        busKilometrageWeekly: 25,

        ptTicket: "half-fare", // none, region, half-fare, region-and-half-fare, season

        numShortFlights: 5,
        numMediumFlights: 0,
        numLongFlights: 2,

        hasBike: false,
        hasEBike: false,
        kilometrageBike: 2000,
        kilometrageEBike: 5000,

        diet: "vegetarian", // omnivore, flexitarian, vegetarian, vegan

        ownsHouse: true,
        houseType: "flat", // flat, detached, semi-detached
        houseStandard: "renovated", // old, renovated, new, minergie
        heatingType: "heat-pump", // oil, gas, electric, heat-pump, wood, district-heating, unknown
        houseSize: 100,

        householdMembers: 3,

        co2CertificateBasePrice: 900,
        reductionTarget: 0.7 // i.e. target is to reduce consumption to 70%
    };

    let criticalSurveySettings = {'language':'de','locale':'de-CH','hasAccessToCar':false,'ownsCar':false,'carKilometrageYearly':null,'car':'','carValue':null,'trainKilometrageWeekly':100,'tramKilometrageWeekly':0,'busKilometrageWeekly':0,'ptTicket':'none','numShortFlights':0,'numMediumFlights':1,'numLongFlights':0,'hasBike':false,'hasEBike':true,'kilometrageBike':0,'kilometrageEBike':80,'diet':'omnivore','ownsHouse':false,'houseType':'flat','houseStandard':'old','heatingType':'gas','houseSize':45,'householdMembers':1,'hasSolarPanels':false,'co2CertificateBasePrice':170,'hiddenTextSelector':'#QR\\\\~QID122','reductionTarget':0.7}

    onload(surveySettings);
}

// call from Qualtrics to configure the priority evaluator
function onload(surveySettings) {
    var evaluatorSettings = buildEvaluatorSettings(surveySettings);
    configureDebug(evaluatorSettings);
    buildChart(evaluatorSettings);
    initialFieldUpdate(evaluatorSettings);
    resetCompensationOptions();
    updateCompensationOptions();
    addEvaluatorEventListeners();
    isInitialized();
    fetchCurrentState();
}

// a function that can return total even if the PE has not been initialized yet
function getStartingTotal(surveySettings) {
    var evaluatorSettings = buildEvaluatorSettings(surveySettings);
    return calculateActualValues(evaluatorSettings);
}

function isInitialized() {
    evaluatorSettings.initialized = true;
}

function configureDebug(evaluatorSettings) {
    var elements = jQuery(".tooltip");
    for (i = 0; i < elements.length; i++) {
        if (evaluatorSettings.enableDebug) elements[i].style.display = "flex";
        else elements[i].style.display = "none";
    }
}

// call from Qualtrics to fetch the results
function getResults() {
    return evaluatorSettings;
}

function buildChart(evaluatorSettings) {
    if (evaluatorSettings.language == "de") var localeChartTexts = texts.de.chart;
    else if (evaluatorSettings.language == "fr") var localeChartTexts = texts.fr.chart;
    else if (evaluatorSettings.language == "it") var localeChartTexts = texts.it.chart;
    else var localeChartTexts = texts.en.chart;

    const labels = localeChartTexts.labels;
    const data = {
        labels: labels,
        datasets: [
        {
            label: localeChartTexts.categoryHouseLabel,
            data: house_dataset,
            backgroundColor: '#fad79a',
        },
        {
            label: localeChartTexts.categoryDietLabel,
            data: diet_dataset,
            backgroundColor: '#d99bfd',
        },
        {
            label: localeChartTexts.categoryMobilityLabel,
            data: mobility_dataset,
            backgroundColor: '#9ec3ff',
        },
        {
            label: localeChartTexts.categoryTargetLabel,
            data: target_dataset,
            backgroundColor: '#009E73',
        }
      ]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        plugins: {
          title: {
            display: false,
            text: 'Title'
          },
        },
        responsive: false,
        legend: {
            display: false,
            labels: {
                fontSize: 15,
            },
            position: 'bottom',
        },
        tooltips: {
            enabled: true,
            titleFontSize: 17,
            bodyFontSize: 17,
            callbacks: {
                title: function(context) {
                    var title = context[0].label || '';
                    return title.replaceAll(",", " ");
                }
            }
        },
        scales: {
            xAxes: [{
            stacked: true,
            ticks: {
                fontSize: 17,
                maxRotation: 0,
                minRotation: 0
            },

            }],
            yAxes: [{
                stacked: true,
                ticks: {
                    fontSize: 17,
                },
                scaleLabel: {
                    display: true,
                    labelString: localeChartTexts.yAxisLabel,
                    fontSize: 18,
                },
            }]
        }
      }
    };

    ctx = document.getElementById("chart").getContext('2d');

    chart = new Chart(ctx, config);
}

function buildEvaluatorSettings(surveySettings) {
    evaluatorSettings = {
        // global settings
        enableDebug: surveySettings.enableDebug,
        language: surveySettings.language,
        locale: surveySettings.locale,
        hiddenTextSelector: surveySettings.hiddenTextSelector,

        // Static kilometrages?
        trainKilometrageWeekly: surveySettings.trainKilometrageWeekly,
        tramKilometrageWeekly: surveySettings.tramKilometrageWeekly,
        busKilometrageWeekly: surveySettings.busKilometrageWeekly,

        kilometrageBike: surveySettings.kilometrageBike,
        kilometrageEBike: surveySettings.kilometrageEBike,

        houseType: surveySettings.houseType,
        houseStandard: surveySettings.houseStandard,
        houseSize: surveySettings.houseSize,
        heatingType: surveySettings.heatingType,

        householdMembers: surveySettings.householdMembers,

        reduceKilometrageCar: {
            selected: false,
            enabled: true,
            visible: surveySettings.hasAccessToCar,
            carKilometrageYearly: surveySettings.carKilometrageYearly,
            select: 1.0,
            investment: "",
            annual: "",
        },

        compensateKilometrageCarByPtShort: {
            enabled: true,
            visible: surveySettings.hasAccessToCar,
            compensatedKilometrageYearly: 0.0,
            select: 0.0,
            investment: "",
            annual: "",
        },

        compensateKilometrageCarByPtLong: {
            enabled: true,
            visible: surveySettings.hasAccessToCar,
            compensatedKilometrageYearly: 0.0,
            select: 0.0,
            investment: "",
            annual: "",
        },

        compensateKilometrageCarByBike: {
            enabled: true,
            visible: surveySettings.hasAccessToCar,
            hasBike: surveySettings.hasBike,
            compensatedKilometrageYearly: 0.0,
            select: 0.0,
            investment: "",
            annual: "",
        },

        compensateKilometrageCarByEBike: {
            enabled: true,
            visible: surveySettings.hasAccessToCar,
            hasEBike: surveySettings.hasEBike,
            compensatedKilometrageYearly: 0.0,
            select: 0.0,
            investment: "",
            annual: "",
        },

        compensateKilometrageCarByNone: {
            enabled: true,
            visible: surveySettings.hasAccessToCar,
            compensatedKilometrageYearly: 0.0,
            select: 0.0,
            investment: "",
            annual: "",
        },

        replaceCar: {
            selected: false,
            enabled: true,
            visible: surveySettings.ownsCar,
            car: surveySettings.car,
            selectCar: surveySettings.car,
            investment: "",
            annual: "",
        },

        sellCar: {
            selected: false,
            enabled: true,
            visible: surveySettings.ownsCar,
            carValue: surveySettings.carValue,
            investment: "",
            annual: "",
        },

        ptTicket: {
            selected: false,
            enabled: true,
            visible: true,
            ptTicket: surveySettings.ptTicket,
            selectPtTicket: surveySettings.ptTicket,
            investment: "",
            annual: "",
        },

        shortFlights: {
            selected: false,
            enabled: true,
            visible: surveySettings.numShortFlights > 0,
            numShortFlights: surveySettings.numShortFlights,
            select: 1,
            investment: "",
            annual: "",
        },

        mediumFlights: {
            selected: false,
            enabled: true,
            visible: surveySettings.numMediumFlights > 0,
            numMediumFlights: surveySettings.numMediumFlights,
            select: 1,
            investment: "",
            annual: "",
        },

        longFlights: {
            selected: false,
            enabled: true,
            visible: surveySettings.numLongFlights > 0,
            numLongFlights: surveySettings.numLongFlights,
            select: 1,
            investment: "",
            annual: "",
        },

        diet: {
            selected: false,
            enabled: true,
            visible: true,
            diet: surveySettings.diet,
            selectDiet: surveySettings.diet,
            investment: "",
            annual: "",
        },

        insulateRoof: {
            selected: false,
            enabled: true,
            visible: surveySettings.ownsHouse && (surveySettings.houseStandard == "old" || surveySettings.houseStandard == "renovated") &&
             (surveySettings.houseType == "detached" || surveySettings.houseType == "semi-detached"),
            investment: "",
            annual: "",
        },

        insulateFacade: {
            selected: false,
            enabled: true,
            visible: surveySettings.ownsHouse && (surveySettings.houseStandard == "old" || surveySettings.houseStandard == "renovated") &&
             (surveySettings.houseType == "detached" || surveySettings.houseType == "semi-detached"),
            investment: "",
            annual: "",
        },

        replaceWindows: {
            selected: false,
            enabled: true,
            visible: surveySettings.ownsHouse && (surveySettings.houseStandard == "old" || surveySettings.houseStandard == "renovated") &&
             (surveySettings.houseType == "detached" || surveySettings.houseType == "semi-detached"),
            investment: "",
            annual: "",
        },

        solarPanels: {
            selected: false,
            enabled: true,
            visible: surveySettings.ownsHouse && !surveySettings.hasSolarPanels && (surveySettings.houseType == "detached" || surveySettings.houseType == "semi-detached"),
            investment: "",
            annual: "",
        },

        ventilationSystem: {
            selected: false,
            enabled: true,
            visible: surveySettings.ownsHouse && (surveySettings.houseStandard == "old" || surveySettings.houseStandard == "renovated" || surveySettings.houseStandard == "new") &&
             (surveySettings.houseType == "detached" || surveySettings.houseType == "semi-detached"),
            investment: "",
            annual: "",
        },

        heatPump: {
            selected: false,
            enabled: true,
            visible: surveySettings.ownsHouse && (surveySettings.heatingType == "oil" || surveySettings.heatingType == "gas" || surveySettings.heatingType == "electric") &&
             (surveySettings.houseType == "detached" || surveySettings.houseType == "semi-detached"),
            investment: "",
            annual: "",
        },

        temperatureReduction: {
            selected: false,
            enabled: true,
            visible: true,
            select: 1,
            investment: "",
            annual: "",
        },

        co2Certificate: {
            selected: false,
            enabled: true,
            visible: true,
            select: 1,
            basePrice: surveySettings.co2CertificateBasePrice,
            investment: "",
            annual: "",
        },

        sum: {
            investment: "",
            annual: "",
        }
    };

    evaluatorSettings.initialHouse = calculateHouse(evaluatorSettings);
    evaluatorSettings.initialDiet = calculateDiet(evaluatorSettings);
    evaluatorSettings.initialMobility = calculateMobility(evaluatorSettings);
    evaluatorSettings.target = surveySettings.reductionTarget * (evaluatorSettings.initialHouse + evaluatorSettings.initialDiet + evaluatorSettings.initialMobility);

    return evaluatorSettings;
}

function initialFieldUpdate(evaluatorSettings) {
    target_dataset[2] = evaluatorSettings.target.toFixed(nbDecimals);

    house_dataset[0] = evaluatorSettings.initialHouse.toFixed(nbDecimals);
    house_dataset[1] = evaluatorSettings.initialHouse.toFixed(nbDecimals);
    diet_dataset[0] = evaluatorSettings.initialDiet.toFixed(nbDecimals);
    diet_dataset[1] = evaluatorSettings.initialDiet.toFixed(nbDecimals);
    mobility_dataset[0] = evaluatorSettings.initialMobility.toFixed(nbDecimals);
    mobility_dataset[1] = evaluatorSettings.initialMobility.toFixed(nbDecimals);

    if (evaluatorSettings.language == "de") var localeTexts = texts.de.table;
    else if (evaluatorSettings.language == "fr") var localeTexts = texts.fr.table;
    else if (evaluatorSettings.language == "it") var localeTexts = texts.it.table;
    else var localeTexts = texts.en.table;

    // set texts
    jQuery('#header_selected').html(localeTexts.header.selected);
    jQuery('#header_measure').html(localeTexts.header.measure);
    jQuery('#header_parameter').html(localeTexts.header.parameter);
    jQuery('#header_cost').html(localeTexts.header.cost);
    jQuery('#header_cost2').html(localeTexts.header.cost2);
    jQuery('#header_cost3investment').html(localeTexts.header.cost3investment);
    jQuery('#header_cost3annual').html(localeTexts.header.cost3annual);

    var carKilometrageYearly = evaluatorSettings.reduceKilometrageCar.carKilometrageYearly;

    jQuery('#reduce_kilometrage_car_text').html(localeTexts.body.reduceKilometrageCar);
    jQuery('#reduce_kilometrage_car_select option[value="0.0"]').text("0% (-0 km)");
    jQuery('#reduce_kilometrage_car_select option[value="0.1"]').text("10% (-" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.1,) + " km)");
    jQuery('#reduce_kilometrage_car_select option[value="0.2"]').text("20% (-" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.2) + " km)");
    jQuery('#reduce_kilometrage_car_select option[value="0.3"]').text("30% (-" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.3) + " km)");
    jQuery('#reduce_kilometrage_car_select option[value="0.4"]').text("40% (-" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.4) + " km)");
    jQuery('#reduce_kilometrage_car_select option[value="0.5"]').text("50% (-" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.5) + " km)");
    jQuery('#reduce_kilometrage_car_select option[value="0.6"]').text("60% (-" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.6) + " km)");
    jQuery('#reduce_kilometrage_car_select option[value="0.7"]').text("70% (-" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.7) + " km)");
    jQuery('#reduce_kilometrage_car_select option[value="0.8"]').text("80% (-" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.8) + " km)");
    jQuery('#reduce_kilometrage_car_select option[value="0.9"]').text("90% (-" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.9) + " km)");
    jQuery('#reduce_kilometrage_car_select option[value="1.0"]').text("100% (-" + formatNumber(evaluatorSettings.locale, carKilometrageYearly) + " km)");

    jQuery('#compensate_kilometrage_car_by_pt_short_text').html(localeTexts.body.compensateKilometrageCarByPtShort);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.0"]').text("0% (0 km)");
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.1"]').text("10% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.1) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.2"]').text("20% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.2) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.3"]').text("30% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.3) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.4"]').text("40% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.4) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.5"]').text("50% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.5) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.6"]').text("60% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.6) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.7"]').text("70% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.7) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.8"]').text("80% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.8) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.9"]').text("90% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.9) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="1.0"]').text("100% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_long_text').html(localeTexts.body.compensateKilometrageCarByPtLong);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.0"]').text("0% (0 km)");
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.1"]').text("10% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.1) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.2"]').text("20% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.2) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.3"]').text("30% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.3) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.4"]').text("40% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.4) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.5"]').text("50% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.5) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.6"]').text("60% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.6) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.7"]').text("70% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.7) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.8"]').text("80% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.8) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.9"]').text("90% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.9) + " km)");
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="1.0"]').text("100% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly) + " km)");
    jQuery('#compensate_kilometrage_car_by_bike_text').html(localeTexts.body.compensateKilometrageCarByBike);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.0"]').text("0% (0 km)");
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.1"]').text("10% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.1) + " km)");
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.2"]').text("20% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.2) + " km)");
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.3"]').text("30% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.3) + " km)");
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.4"]').text("40% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.4) + " km)");
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.5"]').text("50% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.5) + " km)");
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.6"]').text("60% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.6) + " km)");
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.7"]').text("70% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.7) + " km)");
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.8"]').text("80% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.8) + " km)");
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.9"]').text("90% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.9) + " km)");
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="1.0"]').text("100% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly) + " km)");
    jQuery('#compensate_kilometrage_car_by_ebike_text').html(localeTexts.body.compensateKilometrageCarByEBike);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.0"]').text("0% (0 km)");
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.1"]').text("10% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.1) + " km)");
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.2"]').text("20% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.2) + " km)");
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.3"]').text("30% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.3) + " km)");
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.4"]').text("40% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.4) + " km)");
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.5"]').text("50% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.5) + " km)");
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.6"]').text("60% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.6) + " km)");
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.7"]').text("70% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.7) + " km)");
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.8"]').text("80% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.8) + " km)");
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.9"]').text("90% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.9) + " km)");
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="1.0"]').text("100% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly) + " km)");
    jQuery('#compensate_kilometrage_car_by_none_text').html(localeTexts.body.compensateKilometrageCarByNone);
    jQuery('#compensate_kilometrage_car_by_none_select option[value="0.0"]').text("0% (0 km)");
    jQuery('#compensate_kilometrage_car_by_none_select option[value="0.1"]').text("10% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.1) + " km)");
    jQuery('#compensate_kilometrage_car_by_none_select option[value="0.2"]').text("20% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.2) + " km)");
    jQuery('#compensate_kilometrage_car_by_none_select option[value="0.3"]').text("30% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.3) + " km)");
    jQuery('#compensate_kilometrage_car_by_none_select option[value="0.4"]').text("40% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.4) + " km)");
    jQuery('#compensate_kilometrage_car_by_none_select option[value="0.5"]').text("50% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.5) + " km)");
    jQuery('#compensate_kilometrage_car_by_none_select option[value="0.6"]').text("60% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.6) + " km)");
    jQuery('#compensate_kilometrage_car_by_none_select option[value="0.7"]').text("70% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.7) + " km)");
    jQuery('#compensate_kilometrage_car_by_none_select option[value="0.8"]').text("80% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.8) + " km)");
    jQuery('#compensate_kilometrage_car_by_none_select option[value="0.9"]').text("90% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly * 0.9) + " km)");
    jQuery('#compensate_kilometrage_car_by_none_select option[value="1.0"]').text("100% (" + formatNumber(evaluatorSettings.locale, carKilometrageYearly) + " km)");
    jQuery('#compensate_kilometrage_car_by_none_text').addClass("disabledText");
    jQuery('#compensate_kilometrage_car_by_none_select').attr("disabled", true);

    jQuery('#replace_car_text').html(localeTexts.body.replaceCar);
    jQuery('#replace_car_select option[value="petrol-small"]').text(localeTexts.body.replaceCarOptionPetrolSmall);
    jQuery('#replace_car_select option[value="petrol-medium"]').text(localeTexts.body.replaceCarOptionPetrolMedium);
    jQuery('#replace_car_select option[value="petrol-large"]').text(localeTexts.body.replaceCarOptionPetrolLarge);
    jQuery('#replace_car_select option[value="diesel-medium"]').text(localeTexts.body.replaceCarOptionDieselMedium);
    jQuery('#replace_car_select option[value="diesel-large"]').text(localeTexts.body.replaceCarOptionDieselLarge);
    jQuery('#replace_car_select option[value="phev-medium"]').text(localeTexts.body.replaceCarOptionPhevMedium);
    jQuery('#replace_car_select option[value="phev-large"]').text(localeTexts.body.replaceCarOptionPhevLarge);
    jQuery('#replace_car_select option[value="bev-small"]').text(localeTexts.body.replaceCarOptionBevSmall);
    jQuery('#replace_car_select option[value="bev-medium"]').text(localeTexts.body.replaceCarOptionBevMedium);
    jQuery('#replace_car_select option[value="bev-large"]').text(localeTexts.body.replaceCarOptionBevLarge);
    jQuery('#sell_car_text').html(localeTexts.body.sellCar);
    jQuery('#pt_ticket_text').html(localeTexts.body.ptTicket);
    jQuery('#pt_ticket_select option[value="none"]').text(localeTexts.body.ptTicketOptionNone);
    jQuery('#pt_ticket_select option[value="region"]').text(localeTexts.body.ptTicketOptionRegion);
    jQuery('#pt_ticket_select option[value="half-fare"]').text(localeTexts.body.ptTicketOptionHalfFare);
    jQuery('#pt_ticket_select option[value="region-and-half-fare"]').text(localeTexts.body.ptTicketOptionRegionAndHalfFare);
    jQuery('#pt_ticket_select option[value="season"]').text(localeTexts.body.ptTicketOptionSeason);
    jQuery('#short_flights_text').html(localeTexts.body.shortFlights);
    jQuery('#medium_flights_text').html(localeTexts.body.mediumFlights);
    jQuery('#long_flights_text').html(localeTexts.body.longFlights);
    jQuery('#diet_text').html(localeTexts.body.diet);
    jQuery('#diet_select option[value="omnivore"]').text(localeTexts.body.dietOptionOmnivore);
    jQuery('#diet_select option[value="flexitarian"]').text(localeTexts.body.dietOptionFlexitarian);
    jQuery('#diet_select option[value="vegetarian"]').text(localeTexts.body.dietOptionVegetarian);
    jQuery('#diet_select option[value="vegan"]').text(localeTexts.body.dietOptionVegan);
    jQuery('#insulate_roof_text').html(localeTexts.body.insulateRoof);
    jQuery('#insulate_facade_text').html(localeTexts.body.insulateFacade);
    jQuery('#replace_windows_text').html(localeTexts.body.replaceWindows);
    jQuery('#solar_panels_text').html(localeTexts.body.solarPanels);
    jQuery('#ventilation_system_text').html(localeTexts.body.ventilationSystem);
    jQuery('#heat_pump_text').html(localeTexts.body.heatPump);
    jQuery('#temperature_reduction_text').html(localeTexts.body.temperatureReduction);
    jQuery('#co2_certificate_text').html(localeTexts.body.co2Certificate);
    jQuery('#sum_text').html(localeTexts.body.sum);

    jQuery('#target_reached').html(localeTexts.footer.targetReached);
    jQuery('#target_not_reached').html(localeTexts.footer.targetNotReached);

    // set initial field values

    jQuery('#replace_car_select').val(evaluatorSettings.replaceCar.car);

    if (!evaluatorSettings.reduceKilometrageCar.visible) jQuery('#reduce_kilometrage_car_text').closest("tr").hide();
    if (!evaluatorSettings.compensateKilometrageCarByPtShort.visible) jQuery('#compensate_kilometrage_car_by_pt_short_text').closest("tr").hide();
    if (!evaluatorSettings.compensateKilometrageCarByPtLong.visible) jQuery('#compensate_kilometrage_car_by_pt_long_text').closest("tr").hide();
    if (!evaluatorSettings.compensateKilometrageCarByBike.visible) jQuery('#compensate_kilometrage_car_by_bike_text').closest("tr").hide();
    if (!evaluatorSettings.compensateKilometrageCarByEBike.visible) jQuery('#compensate_kilometrage_car_by_ebike_text').closest("tr").hide();
    if (!evaluatorSettings.compensateKilometrageCarByNone.visible) jQuery('#compensate_kilometrage_car_by_none_text').closest("tr").hide();
    if (!evaluatorSettings.replaceCar.visible) jQuery('#replace_car_text').closest("tr").hide();
    if (!evaluatorSettings.sellCar.visible) jQuery('#sell_car_text').closest("tr").hide();

    jQuery('#pt_ticket_select').val(evaluatorSettings.ptTicket.ptTicket);

    let maxFlightsReduction = 100;
    if (!evaluatorSettings.shortFlights.visible) jQuery('#short_flights_text').closest("tr").hide();
    else {
        for (let i = 1; i <= evaluatorSettings.shortFlights.numShortFlights && i <= maxFlightsReduction; i++) {
            jQuery('#short_flights_select').append(jQuery('<option>').val(i).text(i));
        }
    }
    if (!evaluatorSettings.mediumFlights.visible) jQuery('#medium_flights_text').closest("tr").hide();
    else {
        for (let i = 1; i <= evaluatorSettings.mediumFlights.numMediumFlights && i <= maxFlightsReduction; i++) {
            jQuery('#medium_flights_select').append(jQuery('<option>').val(i).text(i));
        }
    }
    if (!evaluatorSettings.longFlights.visible) jQuery('#long_flights_text').closest("tr").hide();
    else {
        for (let i = 1; i <= evaluatorSettings.longFlights.numLongFlights && i <= maxFlightsReduction; i++) {
            jQuery('#long_flights_select').append(jQuery('<option>').val(i).text(i));
        }
    }

    jQuery('#diet_select').val(evaluatorSettings.diet.diet);

    if (!evaluatorSettings.insulateRoof.visible) jQuery('#insulate_roof_text').closest("tr").hide();
    if (!evaluatorSettings.insulateFacade.visible) jQuery('#insulate_facade_text').closest("tr").hide();
    if (!evaluatorSettings.replaceWindows.visible) jQuery('#replace_windows_text').closest("tr").hide();
    if (!evaluatorSettings.solarPanels.visible) jQuery('#solar_panels_text').closest("tr").hide();
    if (!evaluatorSettings.ventilationSystem.visible) jQuery('#ventilation_system_text').closest("tr").hide();
    if (!evaluatorSettings.heatPump.visible) jQuery('#heat_pump_text').closest("tr").hide();

    if (!evaluatorSettings.co2Certificate.visible) jQuery('#co2_certificate_text').closest("tr").hide();
    else {
        let maxReduction = 300;
        let startingTotal = calculateActualValues(evaluatorSettings).actualTotal;
        for (let i = 2; i <= startingTotal && i <= maxReduction; i++) {
            jQuery('#co2_certificate_select').append(jQuery('<option>').val(i).text(i + " t"));
        }
    }
}

function resetCompensationOptions() {
    var reduction = parseFloat(jQuery('#reduce_kilometrage_car_select').val());

    jQuery('#compensate_kilometrage_car_by_pt_short_select').val('0.0');
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.0"]').toggle(true).attr('disabled', false);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.1"]').toggle(reduction >= 0.1).attr('disabled', reduction < 0.1);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.2"]').toggle(reduction >= 0.2).attr('disabled', reduction < 0.2);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.3"]').toggle(reduction >= 0.3).attr('disabled', reduction < 0.3);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.4"]').toggle(reduction >= 0.4).attr('disabled', reduction < 0.4);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.5"]').toggle(reduction >= 0.5).attr('disabled', reduction < 0.5);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.6"]').toggle(reduction >= 0.6).attr('disabled', reduction < 0.6);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.7"]').toggle(reduction >= 0.7).attr('disabled', reduction < 0.7);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.8"]').toggle(reduction >= 0.8).attr('disabled', reduction < 0.8);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.9"]').toggle(reduction >= 0.9).attr('disabled', reduction < 0.9);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="1.0"]').toggle(reduction >= 1.0).attr('disabled', reduction < 1.0);

    jQuery('#compensate_kilometrage_car_by_pt_long_select').val('0.0');
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.0"]').toggle(true).attr('disabled', false);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.1"]').toggle(reduction >= 0.1).attr('disabled', reduction < 0.1);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.2"]').toggle(reduction >= 0.2).attr('disabled', reduction < 0.2);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.3"]').toggle(reduction >= 0.3).attr('disabled', reduction < 0.3);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.4"]').toggle(reduction >= 0.4).attr('disabled', reduction < 0.4);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.5"]').toggle(reduction >= 0.5).attr('disabled', reduction < 0.5);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.6"]').toggle(reduction >= 0.6).attr('disabled', reduction < 0.6);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.7"]').toggle(reduction >= 0.7).attr('disabled', reduction < 0.7);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.8"]').toggle(reduction >= 0.8).attr('disabled', reduction < 0.8);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.9"]').toggle(reduction >= 0.9).attr('disabled', reduction < 0.9);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="1.0"]').toggle(reduction >= 1.0).attr('disabled', reduction < 1.0);

    jQuery('#compensate_kilometrage_car_by_bike_select').val('0.0');
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.0"]').toggle(true).attr('disabled', false);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.1"]').toggle(reduction >= 0.1).attr('disabled', reduction < 0.1);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.2"]').toggle(reduction >= 0.2).attr('disabled', reduction < 0.2);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.3"]').toggle(reduction >= 0.3).attr('disabled', reduction < 0.3);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.4"]').toggle(reduction >= 0.4).attr('disabled', reduction < 0.4);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.5"]').toggle(reduction >= 0.5).attr('disabled', reduction < 0.5);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.6"]').toggle(reduction >= 0.6).attr('disabled', reduction < 0.6);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.7"]').toggle(reduction >= 0.7).attr('disabled', reduction < 0.7);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.8"]').toggle(reduction >= 0.8).attr('disabled', reduction < 0.8);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.9"]').toggle(reduction >= 0.9).attr('disabled', reduction < 0.9);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="1.0"]').toggle(reduction >= 1.0).attr('disabled', reduction < 1.0);

    jQuery('#compensate_kilometrage_car_by_ebike_select').val('0.0');
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.0"]').toggle(true).attr('disabled', false);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.1"]').toggle(reduction >= 0.1).attr('disabled', reduction < 0.1);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.2"]').toggle(reduction >= 0.2).attr('disabled', reduction < 0.2);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.3"]').toggle(reduction >= 0.3).attr('disabled', reduction < 0.3);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.4"]').toggle(reduction >= 0.4).attr('disabled', reduction < 0.4);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.5"]').toggle(reduction >= 0.5).attr('disabled', reduction < 0.5);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.6"]').toggle(reduction >= 0.6).attr('disabled', reduction < 0.6);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.7"]').toggle(reduction >= 0.7).attr('disabled', reduction < 0.7);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.8"]').toggle(reduction >= 0.8).attr('disabled', reduction < 0.8);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.9"]').toggle(reduction >= 0.9).attr('disabled', reduction < 0.9);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="1.0"]').toggle(reduction >= 1.0).attr('disabled', reduction < 1.0);
}

function updateCompensationOptions() {
    var reduction = parseFloat(jQuery('#reduce_kilometrage_car_select').val());
    var compensationByPtShort = parseFloat(jQuery('#compensate_kilometrage_car_by_pt_short_select').val());
    var compensationByPtLong = parseFloat(jQuery('#compensate_kilometrage_car_by_pt_long_select').val());
    var compensationByBike = parseFloat(jQuery('#compensate_kilometrage_car_by_bike_select').val());
    var compensationByEBike = parseFloat(jQuery('#compensate_kilometrage_car_by_ebike_select').val());

    var none = reduction - compensationByPtShort - compensationByPtLong - compensationByBike - compensationByEBike;
    var rangePtShort = compensationByPtShort + none;
    var rangePtLong = compensationByPtLong + none;
    var rangeBike = compensationByBike + none;
    var rangeEBike = compensationByEBike + none;

    rangePtShort = rangePtShort.toPrecision(1);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.0"]').toggle(true).attr('disabled', false);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.1"]').toggle(rangePtShort >= 0.1).attr('disabled', rangePtShort < 0.1);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.2"]').toggle(rangePtShort >= 0.2).attr('disabled', rangePtShort < 0.2);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.3"]').toggle(rangePtShort >= 0.3).attr('disabled', rangePtShort < 0.3);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.4"]').toggle(rangePtShort >= 0.4).attr('disabled', rangePtShort < 0.4);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.5"]').toggle(rangePtShort >= 0.5).attr('disabled', rangePtShort < 0.5);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.6"]').toggle(rangePtShort >= 0.6).attr('disabled', rangePtShort < 0.6);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.7"]').toggle(rangePtShort >= 0.7).attr('disabled', rangePtShort < 0.7);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.8"]').toggle(rangePtShort >= 0.8).attr('disabled', rangePtShort < 0.8);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="0.9"]').toggle(rangePtShort >= 0.9).attr('disabled', rangePtShort < 0.9);
    jQuery('#compensate_kilometrage_car_by_pt_short_select option[value="1.0"]').toggle(rangePtShort >= 1.0).attr('disabled', rangePtShort < 1.0);

    rangePtLong = rangePtLong.toPrecision(1);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.0"]').toggle(true).attr('disabled', false);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.1"]').toggle(rangePtLong >= 0.1).attr('disabled', rangePtLong < 0.1);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.2"]').toggle(rangePtLong >= 0.2).attr('disabled', rangePtLong < 0.2);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.3"]').toggle(rangePtLong >= 0.3).attr('disabled', rangePtLong < 0.3);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.4"]').toggle(rangePtLong >= 0.4).attr('disabled', rangePtLong < 0.4);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.5"]').toggle(rangePtLong >= 0.5).attr('disabled', rangePtLong < 0.5);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.6"]').toggle(rangePtLong >= 0.6).attr('disabled', rangePtLong < 0.6);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.7"]').toggle(rangePtLong >= 0.7).attr('disabled', rangePtLong < 0.7);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.8"]').toggle(rangePtLong >= 0.8).attr('disabled', rangePtLong < 0.8);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="0.9"]').toggle(rangePtLong >= 0.9).attr('disabled', rangePtLong < 0.9);
    jQuery('#compensate_kilometrage_car_by_pt_long_select option[value="1.0"]').toggle(rangePtLong >= 1.0).attr('disabled', rangePtLong < 1.0);

    rangeBike = rangeBike.toPrecision(1);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.0"]').toggle(true).attr('disabled', false);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.1"]').toggle(rangeBike >= 0.1).attr('disabled', rangeBike < 0.1);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.2"]').toggle(rangeBike >= 0.2).attr('disabled', rangeBike < 0.2);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.3"]').toggle(rangeBike >= 0.3).attr('disabled', rangeBike < 0.3);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.4"]').toggle(rangeBike >= 0.4).attr('disabled', rangeBike < 0.4);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.5"]').toggle(rangeBike >= 0.5).attr('disabled', rangeBike < 0.5);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.6"]').toggle(rangeBike >= 0.6).attr('disabled', rangeBike < 0.6);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.7"]').toggle(rangeBike >= 0.7).attr('disabled', rangeBike < 0.7);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.8"]').toggle(rangeBike >= 0.8).attr('disabled', rangeBike < 0.8);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="0.9"]').toggle(rangeBike >= 0.9).attr('disabled', rangeBike < 0.9);
    jQuery('#compensate_kilometrage_car_by_bike_select option[value="1.0"]').toggle(rangeBike >= 1.0).attr('disabled', rangeBike < 1.0);

    rangeEBike = rangeEBike.toPrecision(1);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.0"]').toggle(true).attr('disabled', false);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.1"]').toggle(rangeEBike >= 0.1).attr('disabled', rangeEBike < 0.1);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.2"]').toggle(rangeEBike >= 0.2).attr('disabled', rangeEBike < 0.2);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.3"]').toggle(rangeEBike >= 0.3).attr('disabled', rangeEBike < 0.3);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.4"]').toggle(rangeEBike >= 0.4).attr('disabled', rangeEBike < 0.4);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.5"]').toggle(rangeEBike >= 0.5).attr('disabled', rangeEBike < 0.5);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.6"]').toggle(rangeEBike >= 0.6).attr('disabled', rangeEBike < 0.6);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.7"]').toggle(rangeEBike >= 0.7).attr('disabled', rangeEBike < 0.7);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.8"]').toggle(rangeEBike >= 0.8).attr('disabled', rangeEBike < 0.8);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="0.9"]').toggle(rangeEBike >= 0.9).attr('disabled', rangeEBike < 0.9);
    jQuery('#compensate_kilometrage_car_by_ebike_select option[value="1.0"]').toggle(rangeEBike >= 1.0).attr('disabled', rangeEBike < 1.0);

    if (none < 0.0001) jQuery('#compensate_kilometrage_car_by_none_select').val("0.0");
    else if (none == 1) jQuery('#compensate_kilometrage_car_by_none_select').val("1.0");
    else jQuery('#compensate_kilometrage_car_by_none_select').val(none.toPrecision(1));
}

function fetchCurrentState() {
    // create deep copy
    var settings = JSON.parse(JSON.stringify(evaluatorSettings));
    if (!settings.initialized) return;

    settings.sum.investment = 0.0;
    settings.sum.annual = 0.0;

    settings.reduceKilometrageCar.selected = jQuery('#reduce_kilometrage_car').is(":checked");
    settings.reduceKilometrageCar.select = parseFloat(jQuery('#reduce_kilometrage_car_select').val());
;
    settings.compensateKilometrageCarByPtShort.compensatedKilometrageYearly = parseFloat(jQuery('#compensate_kilometrage_car_by_pt_short_select').val());
    settings.compensateKilometrageCarByPtLong.compensatedKilometrageYearly = parseFloat(jQuery('#compensate_kilometrage_car_by_pt_long_select').val());
    settings.compensateKilometrageCarByBike.compensatedKilometrageYearly = parseFloat(jQuery('#compensate_kilometrage_car_by_bike_select').val());
    settings.compensateKilometrageCarByEBike.compensatedKilometrageYearly = parseFloat(jQuery('#compensate_kilometrage_car_by_ebike_select').val());
    settings.compensateKilometrageCarByNone.compensatedKilometrageYearly = parseFloat(jQuery('#compensate_kilometrage_car_by_none_select').val());

    settings.replaceCar.selected = jQuery('#replace_car').is(":checked");
    settings.replaceCar.selectCar = jQuery('#replace_car_select').val();

    settings.sellCar.selected = jQuery('#sell_car').is(":checked");
    if (settings.sellCar.selected) {
        settings.reduceKilometrageCar.enabled = false;
        settings.reduceKilometrageCar.selected = true;
        settings.replaceCar.enabled = false;
        settings.replaceCar.selected = false;
    }

    if (settings.reduceKilometrageCar.selected) {
        settings.compensateKilometrageCarByPtShort.enabled = true;
        settings.compensateKilometrageCarByPtLong.enabled = true;
        settings.compensateKilometrageCarByBike.enabled = true;
        settings.compensateKilometrageCarByEBike.enabled = true;
        settings.compensateKilometrageCarByNone.enabled = true;
    } else {
        settings.compensateKilometrageCarByPtShort.enabled = false;
        settings.compensateKilometrageCarByPtLong.enabled = false;
        settings.compensateKilometrageCarByBike.enabled = false;
        settings.compensateKilometrageCarByEBike.enabled = false;
        settings.compensateKilometrageCarByNone.enabled = false;
    }
    
    settings.ptTicket.selected = jQuery('#pt_ticket').is(":checked");
    settings.ptTicket.selectPtTicket = jQuery('#pt_ticket_select').val();

    settings.shortFlights.selected = jQuery('#short_flights').is(":checked");
    settings.shortFlights.select = parseInt(jQuery('#short_flights_select').val());
    settings.mediumFlights.selected = jQuery('#medium_flights').is(":checked");
    settings.mediumFlights.select = parseInt(jQuery('#medium_flights_select').val());
    settings.longFlights.selected = jQuery('#long_flights').is(":checked");
    settings.longFlights.select = parseInt(jQuery('#long_flights_select').val());

    settings.diet.selected = jQuery('#diet').is(":checked");
    settings.diet.selectDiet = jQuery('#diet_select').val();

    settings.insulateRoof.selected = jQuery('#insulate_roof').is(":checked");
    settings.insulateFacade.selected = jQuery('#insulate_facade').is(":checked");
    settings.replaceWindows.selected = jQuery('#replace_windows').is(":checked");
    settings.solarPanels.selected = jQuery('#solar_panels').is(":checked");
    settings.ventilationSystem.selected = jQuery('#ventilation_system').is(":checked");
    settings.heatPump.selected = jQuery('#heat_pump').is(":checked");
    settings.temperatureReduction.selected = jQuery('#temperature_reduction').is(":checked");
    settings.temperatureReduction.select = parseInt(jQuery('#temperature_reduction_select').val());

    settings.co2Certificate.selected = jQuery('#co2_certificate').is(":checked");
    settings.co2Certificate.select = parseInt(jQuery('#co2_certificate_select').val());

    // store all the changes
    evaluatorSettings = settings;

    var actualValues = calculateActualValues(settings);
    applyActualValues(actualValues);
    fieldUpdate(settings);
    fillDebugColumn(settings);
}

function fillDebugColumn(settings) {
    jQuery('#replace_car_debug').text(JSON.stringify(settings.replaceCar, undefined, 2));
    jQuery('#sell_car_debug').text(JSON.stringify(settings.sellCar, undefined, 2));
    jQuery('#reduce_kilometrage_car_debug').text(JSON.stringify(settings.reduceKilometrageCar, undefined, 2));
    jQuery('#compensate_kilometrage_car_by_pt_short_debug').text(JSON.stringify(settings.compensateKilometrageCarByPtShort, undefined, 2));
    jQuery('#compensate_kilometrage_car_by_pt_long_debug').text(JSON.stringify(settings.compensateKilometrageCarByPtLong, undefined, 2));
    jQuery('#compensate_kilometrage_car_by_bike_debug').text(JSON.stringify(settings.compensateKilometrageCarByBike, undefined, 2));
    jQuery('#compensate_kilometrage_car_by_ebike_debug').text(JSON.stringify(settings.compensateKilometrageCarByEBike, undefined, 2));
    jQuery('#compensate_kilometrage_car_by_none_debug').text(JSON.stringify(settings.compensateKilometrageCarByNone, undefined, 2));
    jQuery('#pt_ticket_debug').text(JSON.stringify(settings.ptTicket, undefined, 2));
    jQuery('#short_flights_debug').text(JSON.stringify(settings.shortFlights, undefined, 2));
    jQuery('#medium_flights_debug').text(JSON.stringify(settings.mediumFlights, undefined, 2));
    jQuery('#long_flights_debug').text(JSON.stringify(settings.longFlights, undefined, 2));
    jQuery('#diet_debug').text(JSON.stringify(settings.diet, undefined, 2));
    jQuery('#insulate_roof_debug').text(JSON.stringify(settings.insulateRoof, undefined, 2));
    jQuery('#insulate_facade_debug').text(JSON.stringify(settings.insulateFacade, undefined, 2));
    jQuery('#replace_windows_debug').text(JSON.stringify(settings.replaceWindows, undefined, 2));
    jQuery('#solar_panels_debug').text(JSON.stringify(settings.solarPanels, undefined, 2));
    jQuery('#ventilation_system_debug').text(JSON.stringify(settings.ventilationSystem, undefined, 2));
    jQuery('#heat_pump_debug').text(JSON.stringify(settings.heatPump, undefined, 2));
    jQuery('#temperature_reduction_debug').text(JSON.stringify(settings.temperatureReduction, undefined, 2));
    jQuery('#co2_certificate_debug').text(JSON.stringify(settings.co2Certificate, undefined, 2));
}

function fieldUpdate(settings) {
    if (settings.sellCar.selected) {
        jQuery('#reduce_kilometrage_car').attr("disabled", true);
        jQuery('#reduce_kilometrage_car').prop("checked", true);
        jQuery('#reduce_kilometrage_car_text').addClass("disabledText");
        jQuery('#reduce_kilometrage_car_select').val('1.0');
        jQuery('#reduce_kilometrage_car_select').attr("disabled", true);
        jQuery('#replace_car').attr("disabled", true);
        jQuery('#replace_car').prop("checked", false);
        jQuery('#replace_car_text').addClass("disabledText");
        jQuery('#replace_car_select').attr("disabled", true);
    } else {
        // uncheck and enable reduce_kilomtrage_car if sellCar has been unchecked
        if(jQuery('#reduce_kilometrage_car').is(":disabled")) {
            jQuery('#reduce_kilometrage_car').attr("disabled", false);
            jQuery('#reduce_kilometrage_car').prop("checked", false);
            jQuery('#reduce_kilometrage_car_select').val('0.0');
        }
        jQuery('#reduce_kilometrage_car_text').removeClass("disabledText");
        jQuery('#reduce_kilometrage_car_select').attr("disabled", false);
        jQuery('#replace_car').attr("disabled", false);
        jQuery('#replace_car_text').removeClass("disabledText");
        jQuery('#replace_car_select').attr("disabled", false);
    }

    if (settings.reduceKilometrageCar.selected) {
        jQuery('#compensate_kilometrage_car_by_pt_short_text').removeClass("disabledText");
        jQuery('#compensate_kilometrage_car_by_pt_short_select').attr("disabled", false);
        jQuery('#compensate_kilometrage_car_by_pt_long_text').removeClass("disabledText");
        jQuery('#compensate_kilometrage_car_by_pt_long_select').attr("disabled", false);
        jQuery('#compensate_kilometrage_car_by_bike_text').removeClass("disabledText");
        jQuery('#compensate_kilometrage_car_by_bike_select').attr("disabled", false);
        jQuery('#compensate_kilometrage_car_by_ebike_text').removeClass("disabledText");
        jQuery('#compensate_kilometrage_car_by_ebike_select').attr("disabled", false);
    } else {
        jQuery('#compensate_kilometrage_car_by_pt_short_text').addClass("disabledText");
        jQuery('#compensate_kilometrage_car_by_pt_short_select').attr("disabled", true);
        jQuery('#compensate_kilometrage_car_by_pt_long_text').addClass("disabledText");
        jQuery('#compensate_kilometrage_car_by_pt_long_select').attr("disabled", true);
        jQuery('#compensate_kilometrage_car_by_bike_text').addClass("disabledText");
        jQuery('#compensate_kilometrage_car_by_bike_select').attr("disabled", true);
        jQuery('#compensate_kilometrage_car_by_ebike_text').addClass("disabledText");
        jQuery('#compensate_kilometrage_car_by_ebike_select').attr("disabled", true);
    }

    jQuery('#reduce_kilometrage_car_investment').html(formatNumber(settings.locale, settings.reduceKilometrageCar.investment, true));
    jQuery('#reduce_kilometrage_car_annual').html(formatNumber(settings.locale, settings.reduceKilometrageCar.annual, true));
    jQuery('#compensate_kilometrage_car_by_pt_short_investment').html(formatNumber(settings.locale, settings.compensateKilometrageCarByPtShort.investment, true));
    jQuery('#compensate_kilometrage_car_by_pt_short_annual').html(formatNumber(settings.locale, settings.compensateKilometrageCarByPtShort.annual, true));
    jQuery('#compensate_kilometrage_car_by_pt_long_investment').html(formatNumber(settings.locale, settings.compensateKilometrageCarByPtLong.investment, true));
    jQuery('#compensate_kilometrage_car_by_pt_long_annual').html(formatNumber(settings.locale, settings.compensateKilometrageCarByPtLong.annual, true));
    jQuery('#compensate_kilometrage_car_by_bike_investment').html(formatNumber(settings.locale, settings.compensateKilometrageCarByBike.investment, true));
    jQuery('#compensate_kilometrage_car_by_bike_annual').html(formatNumber(settings.locale, settings.compensateKilometrageCarByBike.annual, true));
    jQuery('#compensate_kilometrage_car_by_ebike_investment').html(formatNumber(settings.locale, settings.compensateKilometrageCarByEBike.investment, true));
    jQuery('#compensate_kilometrage_car_by_ebike_annual').html(formatNumber(settings.locale, settings.compensateKilometrageCarByEBike.annual, true));
    jQuery('#compensate_kilometrage_car_by_none_investment').html(formatNumber(settings.locale, settings.compensateKilometrageCarByNone.investment, true));
    jQuery('#compensate_kilometrage_car_by_none_annual').html(formatNumber(settings.locale, settings.compensateKilometrageCarByNone.annual, true));

    jQuery('#replace_car_investment').html(formatNumber(settings.locale, settings.replaceCar.investment, true));
    jQuery('#replace_car_annual').html(formatNumber(settings.locale, settings.replaceCar.annual, true));
    jQuery('#sell_car_investment').html(formatNumber(settings.locale, settings.sellCar.investment, true));
    jQuery('#sell_car_annual').html(formatNumber(settings.locale, settings.sellCar.annual, true));
    jQuery('#pt_ticket_investment').html(formatNumber(settings.locale, settings.ptTicket.investment, true));
    jQuery('#pt_ticket_annual').html(formatNumber(settings.locale, settings.ptTicket.annual, true));
    jQuery('#short_flights_investment').html(formatNumber(settings.locale, settings.shortFlights.investment, true));
    jQuery('#short_flights_annual').html(formatNumber(settings.locale, settings.shortFlights.annual, true));
    jQuery('#medium_flights_investment').html(formatNumber(settings.locale, settings.mediumFlights.investment, true));
    jQuery('#medium_flights_annual').html(formatNumber(settings.locale, settings.mediumFlights.annual, true));
    jQuery('#long_flights_investment').html(formatNumber(settings.locale, settings.longFlights.investment, true));
    jQuery('#long_flights_annual').html(formatNumber(settings.locale, settings.longFlights.annual, true));

    jQuery('#diet_investment').html(formatNumber(settings.locale, settings.diet.investment, true));
    jQuery('#diet_annual').html(formatNumber(settings.locale, settings.diet.annual, true));

    jQuery('#insulate_roof_investment').html(formatNumber(settings.locale, settings.insulateRoof.investment, true));
    jQuery('#insulate_roof_annual').html(formatNumber(settings.locale, settings.insulateRoof.annual, true));
    jQuery('#insulate_facade_investment').html(formatNumber(settings.locale, settings.insulateFacade.investment, true));
    jQuery('#insulate_facade_annual').html(formatNumber(settings.locale, settings.insulateFacade.annual, true));
    jQuery('#replace_windows_investment').html(formatNumber(settings.locale, settings.replaceWindows.investment, true));
    jQuery('#replace_windows_annual').html(formatNumber(settings.locale, settings.replaceWindows.annual, true));
    jQuery('#solar_panels_investment').html(formatNumber(settings.locale, settings.solarPanels.investment, true));
    jQuery('#solar_panels_annual').html(formatNumber(settings.locale, settings.solarPanels.annual, true));
    jQuery('#ventilation_system_investment').html(formatNumber(settings.locale, settings.ventilationSystem.investment, true));
    jQuery('#ventilation_system_annual').html(formatNumber(settings.locale, settings.ventilationSystem.annual, true));
    jQuery('#heat_pump_investment').html(formatNumber(settings.locale, settings.heatPump.investment, true));
    jQuery('#heat_pump_annual').html(formatNumber(settings.locale, settings.heatPump.annual, true));
    jQuery('#temperature_reduction_investment').html(formatNumber(settings.locale, settings.temperatureReduction.investment, true));
    jQuery('#temperature_reduction_annual').html(formatNumber(settings.locale, settings.temperatureReduction.annual, true));

    jQuery('#co2_certificate_investment').html(formatNumber(settings.locale, settings.co2Certificate.investment, true));
    jQuery('#co2_certificate_annual').html(formatNumber(settings.locale, settings.co2Certificate.annual, true));

    jQuery('#sum_investment').html(formatNumber(settings.locale, settings.sum.investment, true));
    jQuery('#sum_annual').html(formatNumber(settings.locale, settings.sum.annual, true));
    
    // disable select options in case question is not selected
    jQuery('#replace_car_select').attr("disabled", !settings.replaceCar.selected || settings.sellCar.selected);
    jQuery('#reduce_kilometrage_car_select').attr("disabled", !settings.reduceKilometrageCar.selected || settings.sellCar.selected);
    jQuery('#pt_ticket_select').attr("disabled", !settings.ptTicket.selected);
    jQuery('#short_flights_select').attr("disabled", !settings.shortFlights.selected);
    jQuery('#medium_flights_select').attr("disabled", !settings.mediumFlights.selected);
    jQuery('#long_flights_select').attr("disabled", !settings.longFlights.selected);
    jQuery('#diet_select').attr("disabled", !settings.diet.selected);
    jQuery('#temperature_reduction_select').attr("disabled", !settings.temperatureReduction.selected);
    jQuery('#co2_certificate_select').attr("disabled", !settings.co2Certificate.selected);
}

function formatNumber(locale, value, displayCost=false) {
    // if optional argument 'display cost' is true, the number is formated such that it fits the
    // display of costs in the PE. This inverses the sign (!) and displays a minus or a plus.
    if (typeof value === 'number') {
        if (value == 0) {
            return "-";
        } else {
            let signedValue = displayCost ? -value : value; // reverse costs and revenue
            let returnNumber = new Intl.NumberFormat(locale, {maximumFractionDigits : 0}).format(signedValue);
            if (displayCost && signedValue > 0) {
                return "+" + returnNumber;
            } else {
                return returnNumber;
            }
        }
    } else return value;
}

// Configure the calcuation settings in here.
function calculateActualValues(settings) {
    var actualMobility = calculateMobility(settings);
    var actualDiet = calculateDiet(settings);
    var actualHouse = calculateHouse(settings);
    var actualCertificate = calculateCertificate(settings);

    var actualTotal = actualHouse + actualDiet + actualMobility;
    var actualHouseWithCertificate = actualHouse * ( 1 - actualCertificate / actualTotal);
    var actualDietWithCertificate = actualDiet * ( 1 - actualCertificate / actualTotal);
    var actualMobilityWithCertificate = actualMobility * ( 1 - actualCertificate / actualTotal);
    var actualTotal = actualDietWithCertificate + actualHouseWithCertificate + actualMobilityWithCertificate;
    var actual = {
        actualHouse,
        actualDiet,
        actualMobility,
        actualCertificate,
        actualHouseWithCertificate,
        actualDietWithCertificate,
        actualMobilityWithCertificate,
        actualTotal
    }
    return actual;
}

function calculateMobility(mobilitySettings) {
    var mobility = 0;

    // car
    if (mobilitySettings.replaceCar.car != "") { // only do all this if there is a access to a car
        var existingCar = mobilitySettings.replaceCar.car;
        var carKilometrage = mobilitySettings.reduceKilometrageCar.carKilometrageYearly;
        var variableCostsExistingCar = carKilometrage * carParameter.get(existingCar).get("fuel-consumption") / 100 * carParameter.get(existingCar).get("fuel-price") +
            carKilometrage * carParameter.get(existingCar).get("electricity-consumption") / 100 * carParameter.get(existingCar).get("electricity-price");
        var fixedCostsExistingCar = 2650 + 0.134 * mobilitySettings.sellCar.carValue;

        var actualCar = existingCar;
        var variableCostsActualCar = variableCostsExistingCar;
        var fixedCostsActualCar = fixedCostsExistingCar;
        var actualCarKilometrage = carKilometrage;

        if (!mobilitySettings.sellCar.selected) {
            mobilitySettings.sellCar.investment = "";
            mobilitySettings.sellCar.annual = "";

            if (mobilitySettings.replaceCar.selected) {
                actualCar = mobilitySettings.replaceCar.selectCar;
                variableCostsActualCar = carKilometrage * carParameter.get(actualCar).get("fuel-consumption") / 100 * carParameter.get(actualCar).get("fuel-price") +
                        carKilometrage * carParameter.get(actualCar).get("electricity-consumption") / 100 * carParameter.get(actualCar).get("electricity-price");
                var priceActualCar = carParameter.get(actualCar).get("price");
                fixedCostsActualCar = 2650 + 0.134 * priceActualCar;

                mobilitySettings.replaceCar.investment = priceActualCar - mobilitySettings.sellCar.carValue;
                mobilitySettings.replaceCar.annual = (fixedCostsActualCar - fixedCostsExistingCar) + (variableCostsActualCar - variableCostsExistingCar);

                mobilitySettings.sum.investment += mobilitySettings.replaceCar.investment;
                mobilitySettings.sum.annual += mobilitySettings.replaceCar.annual;
            } else {
                mobilitySettings.replaceCar.investment = "";
                mobilitySettings.replaceCar.annual = "";
            }

            if (mobilitySettings.reduceKilometrageCar.selected) {
                actualCarKilometrage = mobilitySettings.reduceKilometrageCar.carKilometrageYearly * (1 - mobilitySettings.reduceKilometrageCar.select);

               mobilitySettings.reduceKilometrageCar.investment = 0;
               mobilitySettings.reduceKilometrageCar.annual = - variableCostsActualCar * (1 - actualCarKilometrage / carKilometrage);

               mobilitySettings.sum.investment += mobilitySettings.reduceKilometrageCar.investment;
               mobilitySettings.sum.annual += mobilitySettings.reduceKilometrageCar.annual;
            } else {
                mobilitySettings.reduceKilometrageCar.investment = "";
                mobilitySettings.reduceKilometrageCar.annual = "";
            }

            var carCo2 = carParameter.get(actualCar).get("co2");
            var carValue = carCo2 *actualCarKilometrage / 1_000_000;
            mobility += carValue;
        } else { // i.e. we sell the car
            mobilitySettings.sellCar.investment = - mobilitySettings.sellCar.carValue;
            mobilitySettings.sellCar.annual = - fixedCostsActualCar - variableCostsExistingCar;

            mobilitySettings.sum.investment += mobilitySettings.sellCar.investment;
            mobilitySettings.sum.annual += mobilitySettings.sellCar.annual;

            // if we sell the car, we automatically reduce the kilometrage by 100% - all savings are taken into account in the ""sell car"" option
            mobilitySettings.reduceKilometrageCar.investment = "";
            mobilitySettings.reduceKilometrageCar.annual = "";
            mobilitySettings.replaceCar.investment = "";
            mobilitySettings.replaceCar.annual = "";
        }
    }

    // bike
    bikeValue = 0;

    var kilometrageBike = mobilitySettings.kilometrageBike;
    var kilometrageEBike = mobilitySettings.kilometrageEBike;

    if (mobilitySettings.reduceKilometrageCar.selected) {
        var compensateKilometrageCarByBike = mobilitySettings.reduceKilometrageCar.carKilometrageYearly * mobilitySettings.compensateKilometrageCarByBike.compensatedKilometrageYearly;
        kilometrageBike += compensateKilometrageCarByBike;
        if (!mobilitySettings.compensateKilometrageCarByBike.hasBike & compensateKilometrageCarByBike > 0) {
            mobilitySettings.compensateKilometrageCarByBike.investment = bikeParameter.get("bike").get("price");
            mobilitySettings.compensateKilometrageCarByBike.annual = 0;

            mobilitySettings.sum.investment += mobilitySettings.compensateKilometrageCarByBike.investment;
            mobilitySettings.sum.annual += mobilitySettings.compensateKilometrageCarByBike.annual;
        } else {
            mobilitySettings.compensateKilometrageCarByBike.investment = 0;
            mobilitySettings.compensateKilometrageCarByBike.annual = 0;
        }

        var compensateKilometrageCarByEBike = mobilitySettings.reduceKilometrageCar.carKilometrageYearly * mobilitySettings.compensateKilometrageCarByEBike.compensatedKilometrageYearly;
        kilometrageEBike += compensateKilometrageCarByEBike;
        if (!mobilitySettings.compensateKilometrageCarByEBike.hasEBike & compensateKilometrageCarByEBike > 0) {
            mobilitySettings.compensateKilometrageCarByEBike.investment = bikeParameter.get("ebike").get("price");
            mobilitySettings.compensateKilometrageCarByEBike.annual = 0;

            mobilitySettings.sum.investment += mobilitySettings.compensateKilometrageCarByEBike.investment;
            mobilitySettings.sum.annual += mobilitySettings.compensateKilometrageCarByEBike.annual;
        } else {
            mobilitySettings.compensateKilometrageCarByEBike.investment = 0;
            mobilitySettings.compensateKilometrageCarByEBike.annual = 0;
        }
    } else {
        mobilitySettings.compensateKilometrageCarByBike.investment = "";
        mobilitySettings.compensateKilometrageCarByBike.annual = "";
        mobilitySettings.compensateKilometrageCarByEBike.investment = "";
        mobilitySettings.compensateKilometrageCarByEBike.annual = "";
    }

    bikeValue += bikeParameter.get("bike").get("co2") * kilometrageBike * 52 / 1_000_0000;     // there is an error in the script!
    bikeValue += bikeParameter.get("ebike").get("co2") * kilometrageEBike * 52 / 1_000_0000;   // there is an error in the script!
    mobility += bikeValue;

    // pt
    ptValue = 0;
    ptValue += ptParameter.get("train") * mobilitySettings.trainKilometrageWeekly * 52 / 1_000;
    ptValue += ptParameter.get("tram") * mobilitySettings.tramKilometrageWeekly * 52 / 1_000;
    ptValue += ptParameter.get("bus") * mobilitySettings.busKilometrageWeekly * 52 / 1_000;

    var ptTicket = mobilitySettings.ptTicket.ptTicket;
    if (mobilitySettings.ptTicket.selected) {
        var priceExistingTicket = ptTicketParameter.get(mobilitySettings.ptTicket.ptTicket);
        var priceNewTicket = ptTicketParameter.get(mobilitySettings.ptTicket.selectPtTicket);
        mobilitySettings.ptTicket.investment = 0.0;
        mobilitySettings.ptTicket.annual = priceNewTicket - priceExistingTicket;

        mobilitySettings.sum.investment += mobilitySettings.ptTicket.investment;
        mobilitySettings.sum.annual += mobilitySettings.ptTicket.annual;
        ptTicket = mobilitySettings.ptTicket.selectPtTicket;
    } else {
        mobilitySettings.ptTicket.investment = "";
        mobilitySettings.ptTicket.annual = "";
    }

    if (mobilitySettings.reduceKilometrageCar.selected) {
        var compensateKilometrageCarByPtShort = mobilitySettings.reduceKilometrageCar.carKilometrageYearly * mobilitySettings.compensateKilometrageCarByPtShort.compensatedKilometrageYearly;
        ptValue += ptParameter.get("compensationShort") * compensateKilometrageCarByPtShort / 1_000;

        mobilitySettings.compensateKilometrageCarByPtShort.investment = 0;
        mobilitySettings.compensateKilometrageCarByPtShort.annual = 0;
        if (compensateKilometrageCarByPtShort > 0) {
            var factor = 1.0;
            if (ptTicket == "half-fare") factor = 0.5;
            else if (ptTicket == "region" || ptTicket == "region-and-half-fare" || ptTicket == "season") factor = 0;
            mobilitySettings.compensateKilometrageCarByPtShort.annual = (0.2588 * compensateKilometrageCarByPtShort + 5.1926) * factor;
            mobilitySettings.sum.annual += mobilitySettings.compensateKilometrageCarByPtShort.annual;
        }

       var compensateKilometrageCarByPtLong = mobilitySettings.reduceKilometrageCar.carKilometrageYearly * mobilitySettings.compensateKilometrageCarByPtLong.compensatedKilometrageYearly;
       ptValue += ptParameter.get("compensationLong") * compensateKilometrageCarByPtLong / 1_000;

       mobilitySettings.compensateKilometrageCarByPtLong.investment = 0;
       mobilitySettings.compensateKilometrageCarByPtLong.annual = 0;
       if (compensateKilometrageCarByPtLong > 0) {
           var factor = 1.0;
           if (ptTicket == "half-fare" || ptTicket == "region-and-half-fare") factor = 0.5;
           else if (ptTicket == "season") factor = 0;
           mobilitySettings.compensateKilometrageCarByPtLong.annual = (0.2588 * compensateKilometrageCarByPtLong + 5.1926) * factor;
           mobilitySettings.sum.annual += mobilitySettings.compensateKilometrageCarByPtLong.annual;
       }
    } else {
        mobilitySettings.compensateKilometrageCarByPtShort.investment = "";
        mobilitySettings.compensateKilometrageCarByPtShort.annual = "";
        mobilitySettings.compensateKilometrageCarByPtLong.investment = "";
        mobilitySettings.compensateKilometrageCarByPtLong.annual = "";
    }

    mobility += ptValue;

    // flights
    flightsValue = 0;
    numShortFlights = mobilitySettings.shortFlights.numShortFlights;
    numMediumFlights = mobilitySettings.mediumFlights.numMediumFlights;
    numLongFlights = mobilitySettings.longFlights.numLongFlights;
    if (mobilitySettings.shortFlights.selected) {
        numShortFlights -= mobilitySettings.shortFlights.select;
        mobilitySettings.shortFlights.investment = 0;
        mobilitySettings.shortFlights.annual = mobilitySettings.shortFlights.select * flightParameter.get("short").get("price");

        mobilitySettings.sum.investment += mobilitySettings.shortFlights.investment;
        mobilitySettings.sum.annual += mobilitySettings.shortFlights.annual;
    } else {
        mobilitySettings.shortFlights.investment = "";
        mobilitySettings.shortFlights.annual = "";
    }
    if (mobilitySettings.mediumFlights.selected) {
        numMediumFlights -= mobilitySettings.mediumFlights.select;
        mobilitySettings.mediumFlights.investment = 0;
        mobilitySettings.mediumFlights.annual = mobilitySettings.mediumFlights.select * flightParameter.get("medium").get("price");

        mobilitySettings.sum.investment += mobilitySettings.mediumFlights.investment;
        mobilitySettings.sum.annual += mobilitySettings.mediumFlights.annual;
    } else {
        mobilitySettings.mediumFlights.investment = "";
        mobilitySettings.mediumFlights.annual = "";
    }
    if (mobilitySettings.longFlights.selected) {
        numLongFlights -= mobilitySettings.longFlights.select;
        mobilitySettings.longFlights.investment = 0;
        mobilitySettings.longFlights.annual = mobilitySettings.longFlights.select * flightParameter.get("long").get("price");

        mobilitySettings.sum.investment += mobilitySettings.longFlights.investment;
        mobilitySettings.sum.annual += mobilitySettings.longFlights.annual;
    } else {
        mobilitySettings.longFlights.investment = "";
        mobilitySettings.longFlights.annual = "";
    }
    flightsValue += numShortFlights * flightParameter.get("short").get("co2");
    flightsValue += numMediumFlights * flightParameter.get("medium").get("co2");
    flightsValue += numLongFlights * flightParameter.get("long").get("co2");
    mobility += flightsValue;

    return mobility;
}

function calculateDiet(dietSettings) {
    if (dietSettings.diet.selected) {
        var value = dietParameter.get(dietSettings.diet.selectDiet);
        dietSettings.diet.investment = 0;
        dietSettings.diet.annual = 0;

        dietSettings.sum.investment += dietSettings.diet.investment;
        dietSettings.sum.annual += dietSettings.diet.annual;
        if (value == null) {
            console.log("Unknown diet option selected: " + dietSettings.diet);
            return 0;
        } else return value;
    } else {
        dietSettings.diet.investment = "";
        dietSettings.diet.annual = "";
        return dietParameter.get(dietSettings.diet.diet);
    }
}

function calculateHouse(houseSettings) {
    var houseStandard = houseStandardParameter.get(houseSettings.houseStandard);
    var heatingType = heatingTypeParameter.get(houseSettings.heatingType);
    var energyUse = houseSettings.houseSize * houseStandard / heatingEfficiency.get(houseSettings.heatingType);

    var initialHouseEmissions = energyUse * heatingType / 1000;

    var reductionHouse = 0;

    var heatingCosts = energyUse * heatingCostsPerUnit.get(houseSettings.heatingType); 
    var heatingCostsPerTon = heatingCosts / initialHouseEmissions;

    if (houseSettings.insulateRoof.selected) {
        var reductionParameter = houseReductionParameter.get("insulateRoof");
        var factor = reductionParameter.get("factor");
        var investment = reductionParameter.get("price").get(houseSettings.houseType);
        houseSettings.insulateRoof.investment = investment;
        houseSettings.insulateRoof.annual = - factor * initialHouseEmissions * heatingCostsPerTon;
        reductionHouse += factor;

        houseSettings.sum.investment += houseSettings.insulateRoof.investment;
        houseSettings.sum.annual += houseSettings.insulateRoof.annual;
    } else {
        houseSettings.insulateRoof.investment = "";
        houseSettings.insulateRoof.annual = "";
    }

    if (houseSettings.insulateFacade.selected) {
        var reductionParameter = houseReductionParameter.get("insulateFacade");
        var factor = reductionParameter.get("factor");
        var investment = reductionParameter.get("price").get(houseSettings.houseType);
        houseSettings.insulateFacade.investment = investment;
        houseSettings.insulateFacade.annual = - factor * initialHouseEmissions * heatingCostsPerTon;
        reductionHouse += factor;

        houseSettings.sum.investment += houseSettings.insulateFacade.investment;
        houseSettings.sum.annual += houseSettings.insulateFacade.annual;
    } else {
        houseSettings.insulateFacade.investment = "";
        houseSettings.insulateFacade.annual = "";
    }

    if (houseSettings.replaceWindows.selected) {
        var reductionParameter = houseReductionParameter.get("replaceWindows");
        var factor = reductionParameter.get("factor");
        var investment = reductionParameter.get("price").get(houseSettings.houseType);
        houseSettings.replaceWindows.investment = investment;
        houseSettings.replaceWindows.annual = - factor * initialHouseEmissions * heatingCostsPerTon;
        reductionHouse += factor;

        houseSettings.sum.investment += houseSettings.replaceWindows.investment;
        houseSettings.sum.annual += houseSettings.replaceWindows.annual;
    } else {
        houseSettings.replaceWindows.investment = "";
        houseSettings.replaceWindows.annual = "";
    }

    if (houseSettings.solarPanels.selected) {
        var reductionParameter = houseReductionParameter.get("solarPanels");
        var factor = reductionParameter.get("factor");
        var investment = reductionParameter.get("price").get(houseSettings.houseType);
        houseSettings.solarPanels.investment = investment;
        houseSettings.solarPanels.annual = - factor * initialHouseEmissions * heatingCostsPerTon;
        reductionHouse += factor;

        houseSettings.sum.investment += houseSettings.solarPanels.investment;
        houseSettings.sum.annual += houseSettings.solarPanels.annual;
    }else {
        houseSettings.solarPanels.investment = "";
        houseSettings.solarPanels.annual = "";
    }
    if (houseSettings.ventilationSystem.selected) {
        var reductionParameter = houseReductionParameter.get("ventilationSystem");
        var factor = reductionParameter.get("factor");
        var investment = reductionParameter.get("price").get(houseSettings.houseType);
        houseSettings.ventilationSystem.investment = investment;
        houseSettings.ventilationSystem.annual = - factor * initialHouseEmissions * heatingCostsPerTon;
        reductionHouse += factor;

        houseSettings.sum.investment += houseSettings.ventilationSystem.investment;
        houseSettings.sum.annual += houseSettings.ventilationSystem.annual;
    } else {
        houseSettings.ventilationSystem.investment = "";
        houseSettings.ventilationSystem.annual = "";
    }

//     if (houseSettings.heatPump) reductionHouse += houseReductionParameter.get("heatPump").get("factor");
//     if (settings.temperatureReduction) reductionHouse += parseFloat(settings.temperatureReductionValue * 0.05);

    // allow a maximum reduction of 100%
    reductionHouse = Math.min(1, reductionHouse);
    actualHouse = initialHouseEmissions * (1 - reductionHouse);

    // temperature reduction saving needs to be calculated based on the co2 output of the house with all other measures taken into account.
    var savingsHouse = 0;
    
    if (houseSettings.heatPump.selected) {
        var reductionParameter = houseReductionParameter.get("heatPump");
        var factor = reductionParameter.get("factor");
        var investment = reductionParameter.get("price").get(houseSettings.houseType);
        houseSettings.heatPump.investment = investment;
        houseSettings.heatPump.annual = - factor * actualHouse * heatingCostsPerTon;
        savingsHouse += factor;

        houseSettings.sum.investment += houseSettings.heatPump.investment;
        houseSettings.sum.annual += houseSettings.heatPump.annual;
    } else {
        houseSettings.heatPump.investment = "";
        houseSettings.heatPump.annual = "";
    }

    if (houseSettings.temperatureReduction.selected) {
        var reductionParameter = houseReductionParameter.get("temperatureReduction");
        var factor = reductionParameter.get("factor") * houseSettings.temperatureReduction.select;
        var investment = reductionParameter.get("price").get(houseSettings.houseType);
        houseSettings.temperatureReduction.investment = 0;
        houseSettings.temperatureReduction.annual = - factor * actualHouse * heatingCostsPerTon;
        savingsHouse += factor;

        houseSettings.sum.investment += houseSettings.temperatureReduction.investment;
        houseSettings.sum.annual += houseSettings.temperatureReduction.annual;
    } else {
        houseSettings.temperatureReduction.investment = "";
        houseSettings.temperatureReduction.annual = "";
    }

//     if (houseSettings.heatPump) savingsHouse += houseReductionParameter.get("heatPump").get("factor");
//     if (houseSettings.temperatureReduction) savingsHouse += parseFloat(houseSettings.temperatureReductionValue * houseReductionParameter.get("temperatureReduction").get("factor"));
    actualHouse *= (1 - savingsHouse);
//     if (houseSettings.temperatureReduction) actualHouse *= (1 - parseFloat(houseSettings.temperatureReductionValue * houseReductionParameter.get("temperatureReduction").get("factor")));

    return actualHouse;
}


function getCo2CertificatePrice(nbTons, basePrice) {
    let co2CertificateInflationFactor = 1.04;
    if (nbTons <= 0) {
        return 0
    } else if (nbTons < 1) {
        return basePrice;
    }
    
    // price gets higher with more certificates (4 percent per added ton)
    let certificatePrice = basePrice * Math.pow(co2CertificateInflationFactor, nbTons - 1);
    
    return certificatePrice * nbTons;
}

function calculateCertificate(certificateSettings) {
    if (certificateSettings.co2Certificate.selected) {
        var value = parseInt(certificateSettings.co2Certificate.select);
        certificateSettings.co2Certificate.investment = 0;
        certificateSettings.co2Certificate.annual = getCo2CertificatePrice(value, certificateSettings.co2Certificate.basePrice);

        certificateSettings.sum.investment += certificateSettings.co2Certificate.investment;
        certificateSettings.sum.annual += certificateSettings.co2Certificate.annual;
        return value;
    } else {
        certificateSettings.co2Certificate.investment = "";
        certificateSettings.co2Certificate.annual = "";
        return 0;
    }
}

function applyActualValues(actualValues) {
    house_dataset[1] = actualValues.actualHouseWithCertificate.toFixed(nbDecimals);
    diet_dataset[1] = actualValues.actualDietWithCertificate.toFixed(nbDecimals);
    mobility_dataset[1] = actualValues.actualMobilityWithCertificate.toFixed(nbDecimals);

    var data = chart.config.data;
    data.datasets[0].data = house_dataset;
    data.datasets[1].data = diet_dataset;
    data.datasets[2].data = mobility_dataset;
    data.datasets[3].data = target_dataset;
    chart.update();

    evaluatorSettings.actualHouse = actualValues.actualHouse;
    evaluatorSettings.actualDiet = actualValues.actualDiet;
    evaluatorSettings.actualMobility = actualValues.actualMobility;
    evaluatorSettings.actualCertificate = actualValues.actualCertificate;
    evaluatorSettings.actualHouseWithCertificate = actualValues.actualHouseWithCertificate;
    evaluatorSettings.actualDietWithCertificate = actualValues.actualDietWithCertificate;
    evaluatorSettings.actualMobilityWithCertificate = actualValues.actualMobilityWithCertificate;

    var actual = actualValues.actualTotal;
    var target = target_dataset[2];
	
    if (actual <= target) {
        jQuery('#target_reached').closest("tr").show();
        jQuery('#target_not_reached').closest("tr").hide();
        evaluatorSettings.targetReached = true;
        evaluatorSettings.targetNotReached = false;
        evaluatorSettings.targetRemainingCosts = 0;
        setTargetReached(evaluatorSettings.hiddenTextSelector); // function in evaluator-settings.js
    } else {
        jQuery('#target_reached').closest("tr").hide();
        jQuery('#target_not_reached').closest("tr").show();
        evaluatorSettings.targetReached = false;
        evaluatorSettings.targetNotReached = true;
        evaluatorSettings.targetRemainingCosts = getCo2CertificatePrice(actual - target, evaluatorSettings.co2Certificate.basePrice).toFixed();
        unsetTargetReached(evaluatorSettings.hiddenTextSelector); // function in evaluator-settings.js
    }
    evaluatorSettings.actual = actual;
    evaluatorSettings.notYetCompensated = Math.max(0, actual - target);

};


function addEvaluatorEventListeners() {
    jQuery('#reduce_kilometrage_car').click(function() {
        fetchCurrentState();
    });

    jQuery('#reduce_kilometrage_car_select').click(function() {
        fetchCurrentState();
    });

    jQuery('#reduce_kilometrage_car_select').change(function() {
        // jQuery('#reduce_kilometrage_car').prop("checked", true);
        resetCompensationOptions();
        fetchCurrentState();
        updateCompensationOptions();
    });

    jQuery('#compensate_kilometrage_car_by_pt_short_select').click(function() {
        fetchCurrentState();
    });

    jQuery('#compensate_kilometrage_car_by_pt_short_select').change(function() {
        fetchCurrentState();
        updateCompensationOptions();
    });

    jQuery('#compensate_kilometrage_car_by_pt_long_select').click(function() {
        fetchCurrentState();
    });

    jQuery('#compensate_kilometrage_car_by_pt_long_select').change(function() {
        fetchCurrentState();
        updateCompensationOptions();
    });

    jQuery('#compensate_kilometrage_car_by_bike_select').click(function() {
        fetchCurrentState();
    });

    jQuery('#compensate_kilometrage_car_by_bike_select').change(function() {
        fetchCurrentState();
        updateCompensationOptions();
    });

    jQuery('#compensate_kilometrage_car_by_ebike_select').click(function() {
        fetchCurrentState();
    });

    jQuery('#compensate_kilometrage_car_by_ebike_select').change(function() {
        fetchCurrentState();
        updateCompensationOptions();
    });

    jQuery('#replace_car').click(function() {
        fetchCurrentState();
    });

    jQuery('#replace_car_select').click(function() {
        fetchCurrentState();
    });

    jQuery('#replace_car_select').change(function() {
        // jQuery('#replace_car').prop("checked", true);
        fetchCurrentState();
    });

    jQuery('#sell_car').change(function() {
        resetCompensationOptions();
        fetchCurrentState();
        updateCompensationOptions();
    });

    jQuery('#sell_car').click(function() {
        fetchCurrentState();
    });

    jQuery('#pt_ticket').click(function() {
        fetchCurrentState();
    });

    jQuery('#pt_ticket_select').click(function() {
        fetchCurrentState();
    });

    jQuery('#pt_ticket_select').change(function() {
        // jQuery('#pt_ticket').prop("checked", true);
        fetchCurrentState();
    });

    jQuery('#short_flights').click(function() {
        fetchCurrentState();
    });

    jQuery('#short_flights_select').click(function() {
        fetchCurrentState();
    });

    jQuery('#short_flights_select').change(function() {
        // jQuery('#short_flights').prop("checked", true);
        fetchCurrentState();
    });

    jQuery('#medium_flights').click(function() {
        fetchCurrentState();
    });

    jQuery('#medium_flights_select').click(function() {
        fetchCurrentState();
    });

    jQuery('#medium_flights_select').change(function() {
        //jQuery('#medium_flights').prop("checked", true);
        fetchCurrentState();
    });

    jQuery('#long_flights').click(function() {
        fetchCurrentState();
    });

    jQuery('#long_flights_select').click(function() {
        fetchCurrentState();
    });

    jQuery('#long_flights_select').change(function() {
        //jQuery('#long_flights').prop("checked", true);
        fetchCurrentState();
    });

    jQuery('#buy_bike').click(function() {
        fetchCurrentState();
    });

    jQuery('#buy_ebike').click(function() {
        fetchCurrentState();
    });

    jQuery('#diet').click(function() {
        fetchCurrentState();
    });

    jQuery('#diet_select').click(function() {
        fetchCurrentState();
    });

    jQuery('#diet_select').change(function() {
        //jQuery('#diet').prop("checked", true);
        fetchCurrentState();
    });

    jQuery('#insulate_roof').click(function() {
        fetchCurrentState();
    });

    jQuery('#insulate_facade').click(function() {
        fetchCurrentState();
    });

    jQuery('#replace_windows').click(function() {
        fetchCurrentState();
    });

    jQuery('#solar_panels').click(function() {
        fetchCurrentState();
    });

    jQuery('#ventilation_system').click(function() {
        fetchCurrentState();
    });

    jQuery('#heat_pump').click(function() {
        fetchCurrentState();
    });

    jQuery('#temperature_reduction').click(function() {
        fetchCurrentState();
    });

    jQuery('#temperature_reduction_select').click(function() {
        fetchCurrentState();
    });

    jQuery('#temperature_reduction_select').change(function() {
        //jQuery('#temperature_reduction').prop("checked", true);
        fetchCurrentState();
    });

    jQuery('#co2_certificate').click(function() {
        fetchCurrentState();
    });

    jQuery('#co2_certificate_select').click(function() {
        fetchCurrentState();
    });

    jQuery('#co2_certificate_select').change(function() {
        //jQuery('#co2_certificate').prop("checked", true);
        fetchCurrentState();
    });
}

function removeEvaluatorEventListeners() {
    // deactivate all the event listeners
    // can be called to prevent Qualtrics from changing results after submit
    jQuery('#sell_car').off();
    jQuery('#reduce_kilometrage_car').off();
    jQuery('#reduce_kilometrage_car_select').off();
    jQuery('#compensate_kilometrage_car_by_pt_short_select').off();
    jQuery('#compensate_kilometrage_car_by_pt_long_select').off();
    jQuery('#compensate_kilometrage_car_by_bike_select').off();
    jQuery('#compensate_kilometrage_car_by_ebike_select').off();
    jQuery('#replace_car').off();
    jQuery('#replace_car_select').off();
    jQuery('#sell_car').off();
    jQuery('#pt_ticket').off();
    jQuery('#pt_ticket_select').off();
    jQuery('#short_flights').off();
    jQuery('#short_flights_select').off();
    jQuery('#medium_flights').off();
    jQuery('#medium_flights_select').off();
    jQuery('#long_flights').off();
    jQuery('#long_flights_select').off();
    jQuery('#buy_bike').off();
    jQuery('#buy_ebike').off();
    jQuery('#diet').off();
    jQuery('#diet_select').off();
    jQuery('#insulate_roof').off();
    jQuery('#insulate_facade').off();
    jQuery('#replace_windows').off();
    jQuery('#solar_panels').off();
    jQuery('#ventilation_system').off();
    jQuery('#heat_pump').off();
    jQuery('#temperature_reduction').off();
    jQuery('#temperature_reduction_select').off();
    jQuery('#co2_certificate').off();
    jQuery('#co2_certificate_select').off();
}