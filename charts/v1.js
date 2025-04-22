Qualtrics.SurveyEngine.addOnReady(function() {
    console.log("GHG Footprint script started.");

    // ===== Helper: Safe embedded-data retrieval =====
    function getED(key, defaultValue) {
        var val = Qualtrics.SurveyEngine.getEmbeddedData(key);
        return (val === null || val === undefined) ? defaultValue : val;
    }

    // ===== Step 1: Retrieve piped survey responses =====
    var qData = {
        q1 : '${q://QID123/SelectedChoicesRecode}',
        q2 : '${q://QID1/SelectedChoicesRecode}',
        q3 : '${q://QID2/SelectedChoicesRecode}',
        q4 : '${q://QID3/SelectedChoicesRecode}',
        q5 : '${q://QID4/ChoiceNumericEntryValue/1}',
        q6 : '${q://QID5/SelectedChoicesRecode}',
        q7 : '${q://QID201/ChoiceTextEntryValue}',
        q8 : '${q://QID10/SelectedChoicesRecode}',
        q9 : '${q://QID12/ChoiceTextEntryValue}',
        q10 : '${q://QID13/ChoiceTextEntryValue}',
        q11 : '${q://QID14/ChoiceTextEntryValue}',
        q12 : '${q://QID21/SelectedChoicesRecode}',
        q13 : '${q://QID35/SelectedChoicesRecode}',
        q14 : '${q://QID23/SelectedChoicesRecode}',
        q15 : '${q://QID25/ChoiceTextEntryValue}',
        q16 : '${q://QID26/SelectedChoicesRecode}'
    };

    console.log("Piped values:", qData);

    // ===== Step 2: Convert raw responses into evaluator settings =====
    var peData = formatSurveySettings(qData);
    console.log("Formatted PE data:", peData);
    Qualtrics.SurveyEngine.setEmbeddedData('PeInput', JSON.stringify(peData));

    // ===== Step 3: Compute GHG footprint =====
    var total = getStartingTotal(peData);
    console.log("Computed footprint total:", total);

    // ===== Step 4: Update footprint display =====
    jQuery("#footprint").html(total.actualTotal.toFixed(1) + " t CO<sub>2</sub>/year");

    // ===== Step 5: Prepare values =====
    var userDiet = total.actualDiet;
    var userMobility = total.actualMobility;
    var originalFlight = total.actualFlight;
    var userHouse = total.actualHouse;

    // Add a placeholder for simulated flight emissions
    var simulatedFlight = 2.0;
    var userFlight = originalFlight;

    // ===== Step 5a: Set toggle labels based on user's real flight activity =====
    var hasFlown = originalFlight > 0;

    // Update toggle label text
    jQuery("label[for='flightWith']").text(hasFlown ? "With Flights (Remove if checked)" : "Without Flights");
    jQuery("label[for='flightWithout']").text(hasFlown ? "Without Flights (Add back if unchecked)" : "With Flights (Simulated)");

    // Update selected default (based on actual flight data)
    if (!hasFlown) {
        // User did not fly → default to "without" (0 flight), allow toggling to add
        jQuery("#flightWith").prop("checked", true);
        userFlight = 0;
    }

    // ===== Step 6: Create chart =====
    var globalAverage = 5.2;
    var sustainableTarget = 3.0;

    var ctxCombined = document.getElementById("carbonChartComparison").getContext("2d");

    var chartCombined = new Chart(ctxCombined, {
        type: 'bar',
        data: {
            labels: ["Your Emissions", "Global Average", "Sustainable Target"],
            datasets: [
                { label: "Diet", data: [userDiet, 0, 0], backgroundColor: "rgba(217, 155, 253, 0.8)" },
                { label: "Mobility", data: [userMobility, 0, 0], backgroundColor: "rgba(158, 195, 255, 0.8)" },
                { label: "Flight", data: [userFlight, 0, 0], backgroundColor: "rgba(255,205,86,0.8)" },
                { label: "House", data: [userHouse, 0, 0], backgroundColor: "rgba(112, 128, 144, 0.8)" },
                { label: "Global Average", data: [0, globalAverage, 0], backgroundColor: "#4caf50" },
                { label: "Sustainable Target", data: [0, 0, sustainableTarget], backgroundColor: "#8bc34a" }
            ]
        },
        options: {
            scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                        callback: function(value) { return value + " t"; }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "t CO₂/year"
                    }
                }]
            },
            legend: {
                position: "bottom",
                onClick: function() { return; }
            },
            title: {
                display: true,
                text: "Comparison: Your Emissions vs. Global & Sustainable Targets"
            }
        }
    });

    // ===== Step 7: Radio toggle event listener =====
    jQuery('input[name="flightToggle"]').change(function() {
        var selection = jQuery(this).val();

        var newFlight = (selection === "with")
            ? (hasFlown ? originalFlight : 0)
            : (hasFlown ? 0 : simulatedFlight);

        chartCombined.data.datasets[2].data[0] = newFlight;

        // Optionally update the text summary if you'd like
        var updatedTotal = userDiet + userMobility + userHouse + newFlight;
        jQuery("#footprint").html(updatedTotal.toFixed(1) + " t CO<sub>2</sub>/year");

        chartCombined.update();
        console.log("Flight toggled to:", selection, "| New flight value:", newFlight);
    });
});
