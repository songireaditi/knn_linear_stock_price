from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import numpy as np

from sklearn.linear_model import LinearRegression
from sklearn.neighbors import KNeighborsRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

app = Flask(__name__)
CORS(app)

# -------------------------------
# 📊 Prepare Data
# -------------------------------
def prepare_data(stock, period='1y'):
    import numpy as np
    import yfinance as yf
    import pandas as pd

    df = yf.download(stock, period=period)

    if df.empty:
        return None, None, None

    # 🔥 FIX: handle multi-index columns (VERY IMPORTANT)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df = df.reset_index()

    df['t'] = np.arange(len(df))

    df['Target'] = df['Close'].shift(-1)

    # 🔥 remove NaN safely
    df = df.dropna(subset=['Open', 'High', 'Low', 'Volume', 'Target']).reset_index(drop=True)

    # 🔥 features and target
    X = df[['t', 'Open', 'High', 'Low', 'Volume']]
    y = df['Target']

    return X, y, df


# -------------------------------
# Predict Route
# -------------------------------
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        stock = data['stock']
        period = data.get('period' , '1y')
        model_type = data['model']
        k = int(data.get('k', 5))

        X, y, df = prepare_data(stock,period)

        if X is None:
            return jsonify({"error": "Invalid stock"}), 400

        # Train-Test Split (IMPORTANT)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, shuffle=False
        )

        # ---------------- Linear ----------------
        if model_type == "linear":
            model = LinearRegression()
            model.fit(X_train, y_train)
            preds = model.predict(X_test)

        # ---------------- KNN ----------------
        elif model_type == "knn":
            scaler = StandardScaler()

            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)

            model = KNeighborsRegressor(n_neighbors=k)
            model.fit(X_train_scaled, y_train)
            preds = model.predict(X_test_scaled)
        else:
            return jsonify({"error": "Invalid model"}), 400

        # ---------------- Graph Data ----------------
        result = []
        test_indices = X_test.index

        for i, idx in enumerate(test_indices):
            result.append({
                "date": str(df['Date'][idx])[:10],
                "actual": float(y_test.iloc[i].item()),
                "predicted": float(preds[i].item())
            })

        # ---------------- Metrics ----------------
        metrics = {
            "r2": round(r2_score(y_test, preds), 4),
            "mae": round(mean_absolute_error(y_test, preds), 2),
            "mse": round(mean_squared_error(y_test, preds), 2)
        }

        return jsonify({
            "data": result,
            "metrics": metrics
        })

    except Exception as e:
        return jsonify({"error": str(e)})


# -------------------------------
# Compare Route
# -------------------------------
@app.route('/compare', methods=['POST'])
def compare():
    try:
        data = request.json
        stock = data['stock']
        period = data.get('period','1y')
        k = int(data.get('k', 5))

        X, y, df = prepare_data(stock,period)

        if X is None:
            return jsonify({"error": "Invalid stock"}), 400

        # Train-Test Split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, shuffle=False
        )

        # -------- Linear --------
        linear_model = LinearRegression()
        linear_model.fit(X_train, y_train)
        pred_linear = linear_model.predict(X_test)

        # -------- KNN --------
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        knn_model = KNeighborsRegressor(n_neighbors=k)
        knn_model.fit(X_train_scaled, y_train)
        pred_knn = knn_model.predict(X_test_scaled)

        # -------- Metrics --------
        linear_metrics = {
            "r2": round(r2_score(y_test, pred_linear), 4),
            "mae": round(mean_absolute_error(y_test, pred_linear), 2),
            "mse": round(mean_squared_error(y_test, pred_linear), 2)
        }

        knn_metrics = {
            "r2": round(r2_score(y_test, pred_knn), 4),
            "mae": round(mean_absolute_error(y_test, pred_knn), 2),
            "mse": round(mean_squared_error(y_test, pred_knn), 2)
        }

        # -------- Decision --------
        result = (
            "Linear Regression performs better"
            if linear_metrics["r2"] > knn_metrics["r2"]
            else "KNN performs better"
        )

        # -------- Graph Data --------
        graph_data = []
        test_indices = X_test.index

        for i, idx in enumerate(test_indices):
            graph_data.append({
                "date": str(df['Date'][idx])[:10],
                "actual": float(y_test.iloc[i].item()),
                "linear": float(pred_linear[i].item()),
                "knn": float(pred_knn[i].item())
            })

        return jsonify({
            "data": graph_data,
            "linear": linear_metrics,
            "knn": knn_metrics,
            "result": result
        })

    except Exception as e:
        return jsonify({"error": str(e)})


# -------------------------------
#  Home
# -------------------------------
@app.route('/')
def home():
    return "Backend is running "


# -------------------------------
# Run
# -------------------------------
if __name__ == '__main__':
    app.run(debug=True , port=5000)