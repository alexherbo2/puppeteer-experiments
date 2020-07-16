install:
	npm install

scrape: install
	node scraper.js

clean:
	rm -Rf index.json node_modules package-lock.json
