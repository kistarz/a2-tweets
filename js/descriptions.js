function setText(name, value){
	const byId = document.getElementById(name);
	if (byId) {
		byId.innerText = value;
	}
	document.querySelectorAll('.' + name).forEach(function(element){
		element.innerText = value;
	});
}

let written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	written_tweets = runkeeper_tweets
		.map(function(tweet){
			return new tweet(tweet.text, tweet.created_at);
		})
		.filter(function(tweet){
			return tweet.written;
		})
		.map(function(tweet){
			return {tweet: tweet, searchable: tweet.writtenText.toLowerCase() };
		});
	
	updateSearch();	
}

function updateSearch(){
	const search = document.getElementById('textFilter').value;
	const query = search.toLowerCase();
	const table = document.getElementById('tweetTable');

	table.querySelectorAll('tr.tweet-row').forEach*(function(row){
		row.remove();
	});

	if (query === ''){
		setText('searchCount', 0);
		setText('searchText', '');
		return;
	}

	const matches = written_tweets.filter(function(item){
		return item.searchable.includes(query);
	});

	setText('searchCount', matches.length);
	setText('searchText', search);

	const rows = matches.map(function(item, index){
		return item.tweet.getHTMLTableRow(index+1);
	}).join('');

	const body = table.tBodies[table.tBodies.length-1] || table.appendChild(document.createElement('tbody'));
	body.insertAdjacentHTML('beforeend', rows);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById('textFilter').addEventListener('input', updateSearch);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});