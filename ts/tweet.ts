class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const t = this.text;
        if (t.startsWith('Watch my') || t.includes('#RKLive')){
            return 'live_event';
        }
        if (t.startsWith('Achieved a new personal record') || t.includes('#FitnessAlerts') || t.includes('I just set a goal')){
            return 'achievement';
        }
        if (t.startsWith('Just completed') || t.startsWith('Just posted')){
            return 'completed_event';
        }
        return 'miscellaneous';
    }

    //helper for writtens that basically parse
    private get userText():string{
        if (this.source !== 'completed_event'){
            return '';
        }
        const cleaned = this.text
            .replace(/https?:\/\/\S+/g, '')
            .replace(/#Runkeeper\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
        const match = cleaned.match(/Just (?:completed|posted) an? .*?\s-(?:\s+(.*))?$/);
        if (!match || !match[1]){
            return '';
        }
        const text = match[1].trim();
        if (text === 'TomTom MySports Watch'){
            return '';
        }
        return text;
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        return this.userText.length > 0;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return this.userText;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        const match = this.text.match(/Just (?:completed|posted) an? [0-9.]+\s?(?:mi|km)\s+([a-zA-Z\s]+?)(?:\s+-|\s+with\s|\s+https?:|\s+#|$)/i);
        if (match && match[1]) {
            return match[1].trim().toLowerCase();
        }
        return "unknown";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        const match = this.text.match(/Just (?:completed|posted) an? ([0-9.]+)\s?(mi|km)\b/i);
        if (!match){
            return 0;
        }
        const val = parseFloat(match[1]);
        const unit = match[2].toLowerCase();

        if (isNaN(val)){
            return 0;
        }

        if (unit === 'km'){
            return val / 1.609;
        }
        return val;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}