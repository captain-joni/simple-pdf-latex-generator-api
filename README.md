## A simple latexpdf Api Server
This nodesj server generates pdf documents and sends them to the client based on the data which is provided via the http request. 
For testing puposes there is an html file, in which there is a button that sends an http POST request to the api route. 

## what can it do?
This is a nodejs server which can be deployed via docker and docker-compose. 
If an POST request with coresponding data is send to the api route of this server, it generates a pdf and sends it to you. The "coresponding Data" here is an http body with urlencoded From data
The Server will read the provided .tex file and replace every "variable" with the data provided in the request and then generate a pdf using texlive and send the pdf.


## How to use

<git clone "the url of this repo">

1. Deploy via docker otherwise the pdf generation crashes (i have no clue why xD)
2. replace the api route in the server.js with the route you want to use. (in Lien 34 of the server.js)
3. replace the "erste", "zweite" in line 40 and 41 with the keys that ur data will have (key,value pair)
4. replace "muster.tex" in line 46 with the path to your tex file
5. IMPORTANT in line 51 the variables that you choose in your tex file will be replaced by the value of ur provided data (see line 40)
6. if you want to test the setup with the index.html, you need to change the api route in the index.html as well.

Deploy using:
<docker-compose build>
<docker-compose up -d>

I've explained the code a bit more in my annotations within server.js. But they are in German. If you need any additional help pls just open an issue here on github. ;)
