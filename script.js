let classifier;
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
  labelOutput.innerText = 'Modell bereit – warte auf Bild...';

  const image = document.getElementById('input-image');

  image.onload = () => {
    labelOutput.innerText = 'Bild geladen – klassifiziere ...';
    classifier.classify(image, gotResults);
  };

  if (image.complete && image.naturalHeight !== 0) {
    image.onload();
  }
}

function gotResults(err, results) {
  console.log("gotResults called", err, results);
  if (err) {
    console.error(err);
    return;
  }

  if (!results || results.length === 0) {
    labelOutput.innerText = 'Keine Ergebnisse';
    return;
  }

  const labels = results.map(r => r.label);
  const confidences = results.map(r => parseFloat((r.confidence * 100).toFixed(2)));
  console.log("Results:", results);
  // Chart aktualisieren
  resultChart.data.labels = labels;
  resultChart.data.datasets[0].data = confidences;
  resultChart.update();
  console.log("Chart updated with:", resultChart.data);
  console.log("Aktualisiere Chart mit:", labels, confidences);
}