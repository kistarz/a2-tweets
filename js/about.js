//helper to set the text elements on the html page
function setText(name, value){
	const byId = document.getElementById(name);
	if (byId){
		byId.innerText = value;
	}
	document.querySelectorAll('.' + name).forEach(function(element){
		element.innerText = value;
	});
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
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	let earliest = tweet_array[0].time;
	let latest = tweet_array[0].time;

	tweet_array.forEach(function(tweet){
		if (tweet.time < earliest){
			earliest = tweet.time;
		}
		if (tweet.time > latest){
			latest = tweet.time;
		}
	});

	const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
	document.getElementById('firstDate').innerText = earliest.toLocaleDateString('en-US', dateFormat);
	document.getElementById('lastDate').innerText = latest.toLocaleDateString('en-US', dateFormat);

	// after this is just adding categories for tweets
	const total = tweet_array.length;
	const completed = tweet_array.filter(function(tweet){ return tweet.source === 'completed_event'; });
	const live = tweet_array.filter(function(tweet){ return tweet.source === 'live_event'; });
	const achievements = tweet_array.filter(function(tweet){ return tweet.source === 'achievement'; });
	const miscellaneous = tweet_array.filter(function(tweet){ return tweet.source === 'miscellaneous';});

	// format the percents w 2 decimal places!
	function percent(part, whole = total){
		return math.format(part/whole * 100, {notation: 'fixed', precision: 2}) + '%';
	}

	// format and fill in the numbers for the html
	setText('completedEvents', completed.length);
	setText('completedEventsPct', percent(completed.length));
	setText('liveEvents', live.length);
	setText('liveEventsPct', percent(live.length));
	setText('achievements', achievements.length);
	setText('achievementsPct', percent(achievements.length));
	setText('miscellaneous', miscellaneous.length);
	setText('miscellaneousPct', percent(miscellaneous.length));
	const written = completed.filter(function(tweet){return tweet.written;});
	setText('written', written.length);
	setText('writtenPct', percent(written.length, completed.length));	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});