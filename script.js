let classifier;
const imageIds = [
  'input-image-1',
  'input-image-2',
  'input-image-3',
  'input-image-4',
  'input-image-5',
  'input-image-6'
];
const labelOutputs = [
  'label-output-1',
  'label-output-2',
  'label-output-3',
  'label-output-4',
  'label-output-5',
  'label-output-6'
];
const chartInstances = []; // Array to store Chart instances

classifier = ml5.imageClassifier('MobileNet', modelReady);

function modelReady() {
  imageIds.forEach((imageId, index) => {
    const image = document.getElementById(imageId);
    const labelOutput = document.getElementById(labelOutputs[index]);
    const canvasId = `result-chart-${index + 1}`;
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Initialize a chart for this image
    const chart = new Chart(ctx, {
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
    chartInstances.push(chart); // Store the chart instance

    image.onload = () => {
      labelOutput.innerText = 'Bild geladen – klassifiziere ...';
      classifier.classify(image, (results, err) => {
        if (err) {
          console.error(err);
          labelOutput.innerText = 'Fehler bei der Klassifikation';
          return;
        }

        if (!results || results.length === 0) {
          labelOutput.innerText = 'Keine Ergebnisse';
          return;
        }

        const labels = results.map(r => r.label);
        const confidences = results.map(r => parseFloat((r.confidence * 100).toFixed(2)));

        labelOutput.innerText = `Ergebnis: ${labels[0]} (${confidences[0]}%)`;

        // Update the chart for this image
        const currentChart = chartInstances[index];
        currentChart.data.labels = labels;
        currentChart.data.datasets[0].data = confidences;
        currentChart.update();
      });
    };

    // Trigger classification if the image is already loaded
    if (image.complete && image.naturalHeight !== 0) {
      image.onload();
    }
  });
}

function gotResults(results, err) {
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