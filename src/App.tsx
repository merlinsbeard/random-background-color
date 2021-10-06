import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Link,
} from "react-router-dom";
import { useEffect, useState } from "react";

type ColorParams = {
  color: string;
};

const Colour = () => {
  const { color } = useParams<ColorParams>();
  if (color) {
    return (
      <div className="main" style={{ backgroundColor: `#${color}` }}></div>
    );
  }
  return <div>...loading</div>;
};

const randomHexColor = () => {
  return Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");
};

const Home = () => {
  const [colorCardSize, setColorCardSize] = useState({
    height: 90,
    width: 90,
  });
  const [colors, setColors] = useState<string[]>([]);
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [limit, setLimit] = useState(0);

  const mapHexColorToLimit = (limit: number) => {
    const colorSet: Set<string> = new Set();
    while (colorSet.size < limit) {
      colorSet.add(randomHexColor());
    }
    return Array.from(colorSet);
  };

  const handleResize = () => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  useEffect(() => {
    if (limit > colors.length) {
      setColors((prev) => [
        ...prev,
        ...mapHexColorToLimit(limit - colors.length),
      ]);
    } else {
      setColors((prev) => prev.slice(0, limit));
    }
  }, [limit]);

  useEffect(() => {
    setLimit(
      Math.floor(windowDimension.width / colorCardSize.width) *
        Math.floor(windowDimension.height / colorCardSize.height)
    );
  }, [windowDimension]);

  return (
    <div className="color-home">
      {colors.map((c, index) => {
        return (
          <Link
            id={`${index}${c}`}
            to={`/${c}`}
            key={`${index}${c}`}
            className="color-block"
            style={{
              backgroundColor: `#${c}`,
              width: `${colorCardSize.width}px`,
              height: `${colorCardSize.height}px`,
            }}
          ></Link>
        );
      })}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/:color">
          <Colour />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
