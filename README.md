# bartoc-etl
Prototype ETL pipeline for indexing Bartoc data from MongoDB into Solr.


~~~mermaid
graph TD
  A[(🍃 MongoDB)] --> B[ETL Component - Node.js + Vite + TypeScript]
  B --> C[(Solr Index)]
  C --> D[Bartoc Frontend App]
  D --> C

  subgraph Backend
    A
    B
    C
  end

  subgraph Frontend
    D
  end
~~~

### Project root structure
```pgsql
bartoc-etl/
├── node_modules/
├── solr-configs/
│   └── bartoc/
│       └── conf/
│           ├── schema.xml
│           └── solrconfig.xml
├── src/
│   ├── extract/
│       └── readNdjson.ts
│   ├── transform/
│       └── transformToSolr.ts
│   └── types/
│       ├── jskos.ts
│       └── solr.ts
├── main.ts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Setting Up a Local Solr Instance

A common approach is using Docker. For example:
```bash
docker run -d -p 8983:8983 --name solr solr:8
```

After starting Solr, you can create a new collection (for instance, named bartoc):
```bash
docker exec -it solr bin/solr create -c bartoc -n data_driven_schema_configs
```
This command creates a collection using a dynamic, data-driven schema which you can later modify.

##### Mounting a Custom Configset

you can mount your custom config set to a directory inside the container and then create your collection using that config set. For example:

1. Create a local folder with your custom configuration:
```pgsql
solr-configs/
  └── your-configset/
      └── conf/
          ├── schema.xml
          └── solrconfig.xml
```

2. Mount it to a known location inside the container. If the default isn’t available, you can choose another path (for instance, /configsets/your-configset):
```bash
docker run -d -p 8983:8983 --name solr-custom \ -v $(pwd)/solr-configs/your-configset:/configsets/your-configset \ solr:8
```

3. When creating the collection, tell Solr which config set to use. If you mounted it to /configsets/your-configset, create your collection with:
```bash
docker exec -it solr-custom bin/solr create -c bartoc -n your-configset
```

##### Comments on index schema
- Field Types:
  - *string* is used for non-tokenized fields (IDs, keywords).
  - *text_en* is configured with tokenizers and filters suitable for English text.
  - *pdate* and *pint* handle date and integer conversions.

- Fields:
Each field is defined with the proper attributes (indexed, stored, and multiValued where applicable) to match the mapping established.

- Dynamic Fields:
This section ensures that any unexpected or future fields following a naming convention (like *_s, *_txt, etc.) are handled gracefully.

- Copy Fields:
These allow the contents of title_en and description_en to be searched in a general-purpose catch-all field (text).

- Schema Metadata:
The uniqueKey is set to id, and default search behaviors are defined.