//main function to render detachable component
function renderChart(sectionNo, content) {
	if(!content.chartColors) console.error('chartColors is mandatory');
	let colors = content.chartColors.concat(content.chartColors);
	let fillColors = content.chartFillColors ? content.chartFillColors.concat(content.chartFillColors) : colors;
	
	let chartContents = {
		type: content.chartType,
		title: content.chartTitle,
		labels: content.chartLabel,
		vertical: content.chartMinLine,
		isPercent: content.chartAsPercentage,
		isPercentAxis: content.chartAsPercentageAxis,
		xAxisLabel: content.xAxisLabel,
		yAxisLabel: content.yAxisLabel,
		chartBarOrientation: content.chartBarOrientation,
		datasets: content.chartType == 'histogram' ? convertStringArrayToHistogram(content.chartData, content.chartLabel).map((row,index) => {
			return {
				label: row[0],
				data:row.slice(1).map(point => {
					return point == null ? null : 1; //so each dataset is a data point
				}),
				origData: row.slice(1),
				borderColor: colors[index],
				backgroundColor: fillColors[index]
			};
		}) :
		content.chartData.map((row,index,array) => {
			let axisId = undefined;
			let dataType = undefined;
			if(content.chartType == 'line-bar' && array.length == 2) {
				axisId = index == 0 ? 'A' : 'B';
				dataType = content.chartType.startsWith('line') && index == 0 ? 'line' : 'bar';
			}
			return {
				type: dataType,
				label: row[0],
				yAxisID: axisId,
				data: row.slice(1),
				origData: row.slice(1),
				borderColor: colors[index],
				backgroundColor: fillColors[index],
				stack: content.chartBarGrouping ? (index).toString() : undefined
			};
		})
	};
	loadTimeline(sectionNo, chartContents);
}

//change below for each chart render
function loadTimeline(sectionNo, chartContents) {
	let timeline = window['container'+sectionNo];
	let identifier = 'section'+sectionNo;
	let charter = 'chart'+sectionNo;
	if(document.getElementById(charter) == undefined) { // canvas
		let canvas = document.createElement('canvas');
		canvas.id = charter;
		canvas.style.border = '1px solid white';
		document.getElementById(identifier).appendChild(canvas); //parent div
	}
	timeline = document.getElementById(charter);
	// console.log(chartContents.datasets);
	let config = chartContents.type == 'histogram' ? {
		type: 'bar',
		data: chartContents,
		options: {
			indexAxis: 'y',
			responsive: true,
			maintainAspectRatio: false,
			aspectRatio: isMobile() ? 1 : 0.5,
			datasets: {
				bar: {
					barPercentage: 1
				}
			},
			interaction: {
				mode: 'point',
				intersect: false
			},
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: true,
					text: chartContents.title,
					font: {
						size: 15
					}
				},
				tooltip: {
					xAlign: 'center',
					callbacks: {
						label: function(context) {
							return context.dataset.label;
						}
					}
				}
			},
			scales: {
				x: {
					stacked: true,
				},
				y: {
					stacked: true,
				}
			}
		}
	} : {
		type: chartContents.type || 'line',
		data: chartContents,
		options: {
			indexAxis: chartContents.type == 'bar' ? (chartContents.chartBarOrientation || 'y') : undefined,
			responsive: true,
			maintainAspectRatio: false,
			aspectRatio: isMobile() ? 1 : 0.5,
			datasets: {
				bar: {
					barPercentage: 1
				}
			},
			interaction: {
				mode: chartContents.type == 'bar' ? 'point' : 'index',
				intersect: false
			},
			plugins: {
				legend: {
					position: chartContents.datasets.length <= 12 ? 'top' : 'right',
					maxWidth: chartContents.datasets.length <= 12 ? 9999 : 240,
					fullSize: false
				},
				title: {
					display: true,
					text: chartContents.title,
					font: {
						size: 15
					}
				},
				tooltip: {
					xAlign: chartContents.type == 'bar' ? 'center' : undefined,
					callbacks: {
						label: function(context) {
							// console.log(context);
							if(context.dataset.yAxisID != null && chartContents.isPercentAxis.toLowerCase() != context.dataset.yAxisID.toLowerCase())
								return context.dataset.label + ': ' + context.raw;
							return context.dataset.label + ': ' + context.raw + (chartContents.isPercent ? '%' : '');
						}
					}
				},
				drawVerticalLine: chartContents.vertical
			},
			scales: chartContents.type == 'line-bar' ? 
			{
				A: {
					position: 'left',
					title: {
						display: chartContents.xAxisLabel,
						text: chartContents.xAxisLabel || ''
					},
					stacked: chartContents.type == 'bar',
					ticks: {
						callback: function(value, index, values) {
							if(chartContents.isPercent && chartContents.isPercentAxis.toLowerCase() == 'a') return value + '%';
							return this.getLabelForValue(value);
						}
					}
				},
				B: {
					position: 'right',
					title: {
						display: chartContents.xAxisLabel,
						text: chartContents.xAxisLabel || ''
					},
					stacked: chartContents.type == 'bar',
					ticks: {
						callback: function(value, index, values) {
							if(chartContents.isPercent && chartContents.isPercentAxis.toLowerCase() == 'b') return value + '%';
							return this.getLabelForValue(value);
						}
					}
				},
			} : 
			{
				x: {
					title: {
						display: chartContents.xAxisLabel,
						text: chartContents.xAxisLabel || ''
					},
					stacked: chartContents.type == 'bar',
					ticks: {
						callback: function(value, index, values) {
							if(chartContents.isPercent && chartContents.isPercentAxis.toLowerCase() == 'x') return value + '%';
							return this.getLabelForValue(value);
						}
					}
				},
				y: {
					title: {
						display: chartContents.yAxisLabel,
						text: chartContents.yAxisLabel || ''
					},
					stacked: chartContents.type == 'bar',
					ticks: {
						callback: function(value, index, values) {
							if(chartContents.isPercent && chartContents.isPercentAxis.toLowerCase() == 'y') return value + '%';
							return this.getLabelForValue(value);
						}
					}
				}
			}
		},
		plugins: [drawVerticalLine]
	};
	
	window['container'+sectionNo] = new Chart(timeline, config);
}

//helper functions//
const drawVerticalLine = {
  id: 'drawVerticalLine',
  afterDraw(chart, args, options) {
	if(options.lineValue) {
		const {ctx, chartArea: {left, top, bottom, width, height}, scales: {x, y}} = chart;
		const valueY = y.getPixelForValue(options.lineValue);
		const thickness = options.lineWidth || 0;
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = options.lineColor || 'black';
		ctx.lineWidth = thickness;
		ctx.moveTo(valueY,top);
		ctx.lineTo(valueY,bottom);
		ctx.closePath();
		ctx.stroke();		
	}
  }
};

function convertStringArrayToHistogram(chartData, chartLabel) {
	/*
	input: [
		[axislabel, data1, data2, ...],
		[axislabe2, data3, data4, ...]
		... <dataset>
	] && [labels in which <dataset>.length == thisArray.length]
	output: [
		[data1, 1], //1st row
		[data2, 1],
		[data3, (...array of 1 nulls), 1], //2nd row
		[data4, (...array of 1 nulls), 1],
	]
	objective: to change chartData in above json to fit current flow, data1 is data point, 1 is the bar
	*/

	let nullLabel = chartLabel.map(l => null);
	let histogramData = [];
	for(i = 0; i < chartData.length; i++) {
		for(j = 1; j < chartData[i].length-1; j++) { // or use .forEach
			let item = chartData[i][j];
			// console.log(chartData[i][j]);
			let newItem = [];
			newItem.push(item);
			for(k = 0; k < i; k++) {
				newItem.push(null); //duplicate i-1 times
			}
			newItem.push(1);
			histogramData.push(newItem);
		}
	}
	
	// console.log(histogramData);
	return histogramData;
}

const isMobile = function() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches);
};