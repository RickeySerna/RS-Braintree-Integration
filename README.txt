Hello!

Here's my submission for the API support project. It meets all of the requirements for both parts and 
overall, I'm proud of it. Just as a warning, I wanted to have some fun with CSS once I was done so I made 
this thing in the style of a storeowner/developer who is very excited for October. I hope you enjoy.

Anyway, here's how to run this thing. It's a standard Express.js app so it's run much the same that I 
imagine most of these are run. Naturally, you'll need Node.js and npm installed. If you're 
here, you've probably unzipped the file so from here:

1. Before anything, you'll need to input your sandbox credentials to make the app work on your sandbox. 
The call is located in a file called gatewaycreate.js within the root folder. If you open that up, you 
should see a gateway create call and the merchant ID, public key, and private key parameters. Throw your 
own sandbox' values into those fields as strings and you're good to go.

2. Open up a terminal and navigate to this folder

3. Everything neded to make this thing work should be installed, however if you'd like to give this a quick
install, it surely won't hurt. If so, you can run the following command:
	a. npm install

4. Now all that's needed is to run the app with the following command:
	a. npm start

5. Navigate to http://localhost:3000/ on any browser and you should see the app in action.

6. Have fun!