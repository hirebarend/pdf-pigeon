# PDF Pigeon

HTML to PDF in under 2 seconds

## Usage

```shell
curl -X 'POST' \
  'http://localhost:8080/api/v1/render/pdf' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "url": "https://example.com"
}' -o output.pdf
```

## Run Locally

```bash
git clone https://github.com/hirebarend/pdf-pigeon.git

cd pdf-pigeon

npm install

npm run dev

# open http://localhost:8080 in your browser
```

## Deploy to Kubernetes

```bash
helm install pdf-pigeon ./helm-charts
```

## Contributing

We love our contributors! Here's how you can contribute:

- [Open an issue](https://github.com/hirebarend/pdf-pigeon/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/hirebarend/pdf-pigeon/pull) to add new features/make quality-of-life improvements/fix bugs.
