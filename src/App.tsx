import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Link,
  useHistory,
} from "react-router-dom";
import { useEffect, useState } from "react";

type ColorParams = {
  color: string;
};

const randomHexColor = () => {
  return Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");
};


const Colour = () => {
  const { color } = useParams<ColorParams>();
  const history = useHistory();

  if (color === "random") {
    history.push(`/${randomHexColor()}`);
  }

  const handleKeyPress = ({ key }: KeyboardEvent) => {
    if (key === "ArrowRight") {
      history.push(`/${randomHexColor()}`);
    }
    if (key === "ArrowLeft") {
      history.goBack();
    }
    if (key === "ArrowUp") {
      history.push(`/`);
    }
  };


  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  if (color) {
    return (
      <div className="main" style={{ backgroundColor: `#${color}` }}></div>
    );
  }
  return <div>...loading</div>;
};


const Home = () => {
  const history = useHistory();
  const colorCardSize = {
    height: 90,
    width: 90,
  };

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

  const handleKeyPress = ({ key }: KeyboardEvent) => {
    if (key === "ArrowRight") {
      history.push(`/${randomHexColor()}`);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
    return () => {
      window.removeEventListener("resize", handleResize, false);
    };
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
    const n =
      Math.floor(windowDimension.width / colorCardSize.width) *
      Math.floor(windowDimension.height / colorCardSize.height);
    setLimit(n);
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
