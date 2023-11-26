import "./index.css";
import "./icons8-popcorn-96.png";
import { useEffect, useState } from "react";
export default function App() {
  const [movies, setMovies] = useState([]);
  useEffect(function () {
    const getShows = async function () {
      const res = await fetch("https://api.tvmaze.com/shows");
      const movie = await res.json();
      const top50 = movie.filter((_, i) => i < 50);
      localStorage.setItem("items", JSON.stringify(top50));
      setMovies(top50);
    };
    getShows();
  }, []);

  return (
    <div>
      <Header onSetMovies={setMovies} />
      <Main show={movies} onSetMovies={setMovies} />
      <Footer show={movies} />
    </div>
  );
}

function Header({ onSetMovies }) {
  const newShows = [];
  const [description, setDescription] = useState("");
  const handleSearch = async function (query) {
    const res = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
    const data = await res.json();
    if (!description) return;
    data.forEach((show) => {
      newShows.push(show.show);
    });

    onSetMovies(newShows);
    setDescription("");
  };
  return (
    <div className="header">
      <img
        src="https://img.icons8.com/?size=48&id=97192&format=png"
        alt=""
      ></img>
      <form
        className="inputs"
        onSubmit={(e) => {
          e.preventDefault();

          handleSearch(description);
          //   onSetMovies(description);
        }}
      >
        <input
          type="text"
          placeholder="Type in your movie"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>
        <button>Search</button>
      </form>
    </div>
  );
}

function Main({ show, onSetMovies }) {
  return (
    <div className="container">
      {show.map((mov) => {
        return (
          <Card
            imgSrc={
              mov?.image?.medium ??
              "https://static.vecteezy.com/system/resources/thumbnails/009/007/126/small/document-file-not-found-search-no-result-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
            }
            name={mov.name}
            key={mov.id}
            id={mov.id}
            onSetMovies={onSetMovies}
            show={show}
          >
            {mov.language} {mov.status} {mov.runtime} {mov.rating}
          </Card>
        );
      })}
    </div>
  );
}

function Card({ imgSrc, name, onSetMovies, id, show, children }) {
  const newShow = [];
  const singleCard = async function (id) {
    const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
    const data = await res.json();
    newShow.push(data);

    onSetMovies(newShow);
    // onSetMovies((mov) => newShow.id === id);
  };
  return (
    <div
      className={show.length <= 1 ? "card2" : "card"}
      onClick={() => singleCard(id)}
    >
      <div>
        <img src={imgSrc} alt={name} id={id}></img>
        <p className="movie-name">{name}</p>
      </div>

      {show.length <= 1 ? (
        <div>
          <p>Langauge: {children[0]}</p>
          <p>Runtime: {children[4]}min</p>
          <p>Status: {children[2]}</p>
          <p>Rating: {children[6].average}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();

              const items = JSON.parse(localStorage.getItem("items"));
              onSetMovies(items);
            }}
          >
            X
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function Footer({ show }) {
  return (
    <p className="footer">{`There are ${show.length} movies on display! 🍿🎬🎥😃`}</p>
  );
}
