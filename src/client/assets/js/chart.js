import Chart from 'chart.js/auto';

(() => {
  const canvas = document.getElementById('chart')

  function getDataPoints() {
    fetch('/api/corn-price', {method: 'GET'})
      .then(response => response.json())
      .then(data => {displayChart(data.data.cornPrice)})
      .catch((error) => {console.error(error)})
  }

  function displayChart(dataPoints) {
    const data = {
      datasets: [{
        label: 'Price (USD)',
        data: dataPoints,
        fill: false,
        borderColor: 'rgba(246, 244, 238, 0.8)',
        tension: 0.1,
        pointRadius: 0
      }]
    }
  
    const options = {
      parsing: {
        xAxisKey: 'date',
        yAxisKey: 'value'
      },
      hover: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
          titleFont: {
            family: 'IBM Plex Mono',
            size: 10
          },
          bodyFont: {
            family: 'IBM Plex Mono',
            size: 10
          }
        },
        legend: {
          display: false
        }
      },  
      scales: {
        x: {
          border: {
            display: false
          },
          grid: {
            color: 'rgba(246, 244, 238, .05)'
          },
          ticks: {
            color: 'rgba(246, 244, 238, .4)',
            maxTicksLimit: 4,
            font: {
              family: 'IBM Plex Mono',
              size: 10
            },
          }
        },
        y: {
          border: {
            display: false
          },
          grid: {
            color: 'rgba(246, 244, 238, .1)'
          },
          ticks: {
            color: 'rgba(246, 244, 238, .4)',
            maxTicksLimit: 4,
            font: {
              family: 'IBM Plex Mono',
              size: 10
            },
            callback: function(val, index) {
              return '$' + this.getLabelForValue(val)
            }
          }
        }
      }
    };
  
    new Chart(canvas, {
      type: "line",
      data: data,
      options: options
    });

    canvas.classList.remove('loading')
  }

  getDataPoints()
})();