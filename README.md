# Athar Finance

Plateforme de finance et d'apprentissage : analyses de sociétés et d'ETF, cours boursiers, watchlist, portefeuille et simulateurs.

## Démarrage

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

Vite sert le site sur http://localhost:5173 et relaie les requêtes `/api` au backend local sur http://localhost:5000.

### Backend

Avec Python 3.11+ :

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
FMP_API_KEY=votre_cle python app.py
```

Sur Windows, adaptez l'activation du venv et l'attribution de la variable d'environnement.

Pour Docker : définissez `FMP_API_KEY` dans l'environnement, puis `docker compose up --build` à la racine. Le site est sur http://localhost:3000.

## Configuration

- `FMP_API_KEY` (backend) : clé Financial Modeling Prep ; nécessaire aux analyses d'actions et d'ETF. Ne la publiez pas dans les variables Vite.
- `VITE_API_URL` (frontend, production) : adresse de l'API publique (par exemple `https://athar-api.onrender.com/api`). En local, la valeur par défaut est `/api`.
- `CORS_ORIGINS` (backend) : origines frontend autorisées, séparées par des virgules.
- `VITE_PROXY_TARGET` (Vite) : URL du backend utilisé par le proxy local.

## Endpoints

- `GET /api/health`
- `GET /api/market/live-prices`
- `POST /api/chart/history`
- `GET /api/news/latest`
- `POST /api/screening/analyze`
- `POST /api/screening/etf-scan`
- `POST /api/portfolio/analyze`
- `POST /api/simulation/calculate`
- `GET /api/zakat/metals`
- `POST /api/zakat/calculate`

## Limites et fiabilité

- Les cours Yahoo Finance peuvent être différés ou indisponibles. Aucune cotation de secours n'est inventée.
- Le screener n'est pas une certification religieuse. Il indique des données manquantes au lieu d'en déduire une conformité.
- Les ETF peuvent ne pas avoir de positions détaillées si la formule FMP ne les autorise pas.
- Les valorisations de portefeuille sont regroupées par devise : **aucune conversion implicite**.
- Le simulateur DCA est rétrospectif, ses dividendes sont approximatifs et aucune purification forfaitaire n'est calculée.
- Le calcul de zakat reste indicatif : la période de détention lunaire (hawl) et les autres conditions ne sont pas vérifiées.
- Les positions sont stockées localement dans le navigateur et transmises au backend pour les cotations, sans compte utilisateur.
- Les intégrations FMP nécessitent une clé valide, un plan compatible et un déploiement backend joignable.

## Vérifications

```bash
cd frontend && npm run build
cd ../backend && python -m compileall -q .
cd .. && python -m unittest discover -s backend/tests -v
```

Le workflow GitHub Actions lance les builds et les tests sur chaque pull request et push.

## Déploiement Render

Pour un **Web Service** existant : définir `Root Directory = backend`, `Build Command = pip install -r requirements.txt`, `Start Command = gunicorn app:app` et `Health Check Path = /api/health`. Ajouter `FMP_API_KEY` comme variable secrète et `CORS_ORIGINS` avec l'origine exacte du site. Pour un **Static Site** : `Root Directory = frontend`, `Build Command = npm ci && npm run build`, `Publish Directory = dist`, `VITE_API_URL` = URL de l'API incluant `/api`. Cette configuration doit être appliquée à vos services Render ; pousser du code GitHub ne change pas automatiquement leur environnement.
