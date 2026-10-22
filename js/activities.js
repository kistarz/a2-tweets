function setText(name, value){
	const byId = document.getElementById(name);
	if (byId){
		byId.innerText = value;
	}
	document.querySelectorAll('.' + name).forEach(function(element){
		element.innerText = value;
	});
}

function average(numbers){
	return numbers.reduce(function(sum, n) {return sum + n; }, 0) / numbers.length;
}

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const completed = tweet_array.filter(function(tweet) {return tweet.source === 'completed_event'; });
	const counts = {};
	completed.forEach(function(tweet){
		counts[tweet.acitivityType] = (counts[tweet.activityType] || 0) + 1;
	});

	const types = Object.keys(counts).sort(function(a, b) {return counts[b] - counts[a]; });
	setText('numberActivities', types.length);
	setText('firstMost', types[0]);
	setText('secondMost', types[1]);
	setText('thirdMost', types[2]);

	const topThree = types.slice(0, 3);
	const averageDistance = {};
	topThree.forEach(function(type){
		const distances = completed
			.filter(function(tweet) {return tweet.activityType === type && tweet.distance > 0; })
			.map(function(tweet) {return tweet.distance;});
		averageDistance[type] = average(distances);
	});

	const byDistance = topThree.slice().sort(function (a, b) {return averageDistance[b] - averageDistance[a]; });
	const longestType = byDistance[0];
	const shortestType = byDistance[byDistance.length - 1];

	setText('longestActivityType', longestType);
	setText('shortestActivityType', shortestType);

	function isWeekend(tweet){
		const day = tweet.time.getDay();
		return day === 0 || day === 6;
	}

	const longestTweets = completed.filter(function(tweet) {return tweet.activityType === longestType && tweet.distance > 0; });
	const weekendAverage = average(longestTweets.filter(isWeekend).map(function(tweet) {return tweet.distance; }));
	const weekdayAverage = average(longestTweets.filter(function(tweet) {return !isWeekend(tweet); }).map(function(tweet) {return twwet.distance }));
	setText('weekdayOrWeekendLongest', weekendAverage > weekdayAverage ? 'weekends' : 'weekdays');
	
	
	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const activityData = completed.map(function(tweet){
		return{
			activityType: tweet.activityType,
			distance: tweet.distance,
			day: DAYS[tweet.time.getDay()]
		};
	});

	const topThreeData = activityData.filter(function(item) {
		return topThree.includes(item.activityType) && item.distance > 0;
	});
	
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  //TODO: Add mark and encoding
	  "mark" : "bar",
	  "encoding" : {
		"x": {
			"field": "activityType",
			"type": "nominal",
			"sort": "-y",
			"title": "Activity type"
		},
		"y": {
			"aggregate": "count",
			"type": "quantitative",
			"title": "Number of Tweets"
		}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	distance_vis_aggregated_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "mean distance for three most tweeted activities by day of the week!",
		"data": {
			"values": topThreeData
		},
		"width": 500,
		"height": 300,
		"mark": {
			"type": "line",
			"point": true
		},
		"encoding": {
			"x": {
				"field": "day",
				"type": "nominal",
				"sort": DAYS,
				"title": "day of the week",
				"axis": {"labelAngle":0}
			},
			"y": {
				"aggregate": "mean",
				"field": "distance", 
				"type": "quantitative",
				"title": "mean distance in miles"
			},
			"color": {"field": "activityType",
				"type": "nominal",
				"title": "activity type"
			}
		}
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	const allDistances = document.getElementById('distanceVis');
	const meanDistances = document.getElementById('distanceVisAggregated');
	const aggregateButton = document.getElementById('aggregate');

	meanDistances.style.display = 'none'
	aggregateButton.innerText = 'Show means';

	aggregateButton.addEventListener('click', function(){
		const showingMeans = meanDistances.style.display !== 'none';
		meanDistances.style.display = showingMeans ? 'none' : 'block';
		allDistances.style.display = showingMeans ? 'block' : 'none';
		aggregateButton.innerText = showingMeans ? 'Show means' : 'Show all activities';
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});