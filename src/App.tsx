import { ja } from './i18n/ja';
import './App.css';

export function App() {
  return (
    <main className="app">
      <h1>{ja.app.title}</h1>
      <p>{ja.app.tagline}</p>
      <p className="app-muted">{ja.app.preparing}</p>
    </main>
  );
}
