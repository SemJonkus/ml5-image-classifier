let classifier;
const image = document.getElementById('input-image');
const labelOutput = document.getElementById('label-output');

// Chart.js Setup
const ctx = document.getElementById('result-chart').getContext('2d');
let resultChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Confidence (%)',
      data: [],
      backgroundColor: 'rgba(0, 123, 255, 0.6)',
    }]
  },
  options: {
    indexAxis: 'y',
    scales: {
      x: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Confidence in %'
        }
      }
    }
  }
});
classifier = ml5.imageClassifier('MobileNet', modelReady);

function modelReady() {
  labelOutput.innerText = 'Modell bereit – klassifiziere ...';
  classifier.classify(image, gotResults);
}

function gotResults(err, results) {
  if (err) {
    console.error(err);
    return;
  }

  if (!results || results.length === 0) {
    labelOutput.innerText = 'Keine Ergebnisse';
    return;
  }

  const labels = results.map(r => r.label);
  const confidences = results.map(r => (r.confidence * 100).toFixed(2));

  // Chart aktualisieren
  resultChart.data.labels = labels;
  resultChart.data.datasets[0].data = confidences;
  resultChart.update();
  console.log("Aktualisiere Chart mit:", labels, confidences);
}