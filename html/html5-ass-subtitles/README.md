## 2019 update
It seems some people start to star this project. Just a little heads up: I left the fansubbing scene about 8 years ago, which is about when this repository was last updated. If there is no significant reason for me to work on this it's pretty much dead. Feel free to work and play with it.


## Old readme
```
This pack of javascripts require a HTML5 capable browser to work with the <video> tag. 
I have no intention of supporting .SRT as of this point,  as there is a sufficient 
working library for this around. (jquery-srt.js)

Tested browsers:
	* Google Chrome
		* If you use Google Chrome 11 and experience lags and weird subs blinking 
		  around on the screen, please switch to the Beta or Dev channel instead.
		* Google Chrome and Chromium can't streaming OGG-Theora streams. 
		  It'll have to finish loading first before it display the video.
	* Firefox 3
	* Firefox 4		

CSS2 as well as CSS3 don't provide any commands to scale text and letters
	* affected tags: 
		* \fscx
		* \fscy
		
Commands depending on timers or similar constructs ain't implemented yet. 
	* affected tags: 
		* \t
		* \fad
		* \move

Currently these inline ass tags are known to be working: (apply to the whole line)
	* \pos
		* doesn't take \an into account yet!
	* \be
		* doesn't take original style's border or shadow in account!
	* \1c | \c
	* \3c 
		* only hacky-slashy with text-shadow for non-webkit browsers
	* \b0 | \b1
	* \u0 | \u1
	* \s0 | \s1
	* \i0 | \i1

Some code taken from: 
	* http://blog.illyism.com/html5-video-subtitles-experiment/
		- Basically I took some of the base code from there, 
		  for example parts of the timeupdate() function
	* http://stackoverflow.com/questions/646628/javascript-startswith
		- Some helper functions (startsWith)
	* http://binnyva.blogspot.com/2005/10/dump-function-javascript-equivalent-of.html
		- dump() for debugging purposes.
```
