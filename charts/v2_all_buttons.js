Qualtrics.SurveyEngine.addOnReady(function () {
  const footprintEl = jQuery("#footprint");
  const ctx = document.getElementById("carbonChartComparison").getContext("2d");

  // Survey response data
  const qData = {
    q1: '${q://QID123/SelectedChoicesRecode}',
    q2: '${q://QID1/SelectedChoicesRecode}',
    q3: '${q://QID2/SelectedChoicesRecode}',
    q4: '${q://QID3/SelectedChoicesRecode}',
    q5: '${q://QID4/ChoiceNumericEntryValue/1}',
    q6: '${q://QID5/SelectedChoicesRecode}',
    q7: '${q://QID201/ChoiceTextEntryValue}',
    q8: '${q://QID10/SelectedChoicesRecode}',
    q9: '${q://QID12/ChoiceTextEntryValue}',
    q10: '${q://QID13/ChoiceTextEntryValue}',
    q11: '${q://QID14/ChoiceTextEntryValue}',
    q12: '${q://QID21/SelectedChoicesRecode}',
    q13: '${q://QID35/SelectedChoicesRecode}',
    q14: '${q://QID23/SelectedChoicesRecode}',
    q15: '${q://QID25/ChoiceTextEntryValue}',
    q16: '${q://QID26/SelectedChoicesRecode}'
  };

  const peData = formatSurveySettings(qData);
  const total = getStartingTotal(peData);

  const globalAverage = 5.2;
  const sustainableTarget = 3.0;

  let current = {
    diet: peData.diet || "omnivore",
    flightIncluded: total.actualFlight > 0,
    originalFlight: total.actualFlight,
    simulatedFlight: 2.0,
    mobility: total.actualMobility,
    house: total.actualHouse
  };

  function computeTotal() {
    const flight = current.flightIncluded ? current.originalFlight : 0;
    const diet = calculateDiet({ diet: current.diet });
    const house = current.house;
    const mobility = current.mobility;
    return {
      flight, diet, house, mobility,
      total: diet + flight + house + mobility
    };
  }

  let chart;

  function updateChart() {
    const d = computeTotal();
    footprintEl.html(`${d.total.toFixed(1)} t CO<sub>2</sub>/year`);

    const chartData = {
      labels: ["Your Emissions", "Global Avg", "Sustainable Target"],
      datasets: [
        { label: "Diet", data: [d.diet, 0, 0], backgroundColor: "rgba(217, 155, 253, 0.8)" },
        { label: "Mobility", data: [d.mobility, 0, 0], backgroundColor: "rgba(158, 195, 255, 0.8)" },
        { label: "Flight", data: [d.flight, 0, 0], backgroundColor: "rgba(255, 205, 86, 0.8)" },
        { label: "House", data: [d.house, 0, 0], backgroundColor: "rgba(112, 128, 144, 0.8)" },
        { label: "Global Average", data: [0, globalAverage, 0], backgroundColor: "#4caf50" },
        { label: "Sustainable Target", data: [0, 0, sustainableTarget], backgroundColor: "#8bc34a" }
      ]
    };

    if (chart) {
      chart.data = chartData;
      chart.update();
    } else {
      chart = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: { top: 10, bottom: 10, left: 10, right: 10 }
          },
          scales: {
            xAxes: [{
              stacked: true,
              ticks: { fontColor: "#333" },
              scaleLabel: { display: false }
            }],
            yAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true,
                fontColor: "#333",
                callback: value => value + " t"
              },
              scaleLabel: {
                display: true,
                labelString: "t CO₂/year",
                fontColor: "#333"
              },
              gridLines: { color: "rgba(0,0,0,0.1)" }
            }]
          },
          legend: {
            position: "bottom",
            labels: { fontColor: "#333" },
            onClick: () => false
          },
          title: {
            display: true,
            text: "Comparison: Your Emissions vs. Global & Sustainable Targets",
            fontColor: "#333"
          }
        }
      });
    }
  }

  jQuery("input[name='flightToggle']").change(() => {
    current.flightIncluded = jQuery("input[name='flightToggle']:checked").val() === "with";
    updateChart();
  });

  updateChart();
});
