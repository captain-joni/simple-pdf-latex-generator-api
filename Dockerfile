FROM node:16
WORKDIR /app
RUN apt update
RUN apt install texlive-latex-base -y
RUN apt install texlive-latex-extra  -y
RUN apt install texlive-lang-german -y
RUN npm install node-latex
RUN npm install express
RUN npm install escape-latex
COPY package-lock.json ./
RUN npm install package-lock.json
COPY . .
CMD ["npm", "start"]

