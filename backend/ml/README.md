### ML-backend

- Running K-Means Clustering to determine the clusters of assault reports in the recent time
- Determine safest routes using Harvestine path
- Using Google Maps API


### Instructions

- Add API keys under `./env`:
```bash
GOOGLE_API_KEY=<YOUR_API_KEY>
```

- Install poetry: 
```bash
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -

# install dependencies
poetry install
```

- Startup flask server:
```bash
python ./app.py
```
### Running with Docker
- Build Docker images
```bash
docker build -t aarnphm/htn2021:latest
```
- Run Docker images
```bash
docker run -i -t -v $(pwd):/htn aarnphm/htn2021:latest
```
