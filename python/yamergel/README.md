# yamergel
Merges docker-compose.ymls into one unified docker-compose.yml

```
usage: python3 main.py . 
```

Example:

```
➜  tree .
.
├── Makefile
├── _tools
│   ├── combine.py
├── **docker-compose.yml**
├── guacamole
│   ├── docker-compose.yml
│   └── initdb.sql
├── openvpn
│   └── docker-compose.yml
└── postgresdb
    └── docker-compose.yml
```

```python3 yamergl/main.py . > docker-compose.yml``` now generates a unified docker-compose.yml to use with docker-compose!
Wheee!
