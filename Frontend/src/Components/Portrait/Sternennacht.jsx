import useAuth from "../../Context/useAuth";
import sternenNacht from "../../Assets/Bilder/Sternennacht_horizontal.webp";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import menuBackSfx from "../../Assets/Audio/menuBack.mp3";
import KommentarGepostetSfx from "../../Assets/Audio/kommentarGepostet.mp3";
import trashBin from "../../Assets/Bilder/trashBin.png";
import deleteSfx from "../../Assets/Audio/deleteSoundEffect.mp3";
import kommentarEditedSfx from "../../Assets/Audio/kommentarEdited.mp3";
import arrowBack from "../../Assets/Bilder/arrowBack.png";
import pen from "../../Assets/Bilder/pen.png";
import cross from "../../Assets/Bilder/cross.png";
import check from "../../Assets/Bilder/check.png";

function Sternennacht() {
  // States für "POST"
  const [postResponseMessage, setPostResponseMessage] = useState("");
  const [note, setNote] = useState("");
  const [inhalt, setInhalt] = useState("");
  const [gepostetVon, setGepostetVon] = useState("");
  const [leereFelderMeldung, setLeereFelderMeldung] = useState("");

  // States für "GET"
  const [kommentarListe, setKommentarListe] = useState([]);
  const [keineKommentareMessage, setKeineKommentareMessage] = useState("");

  // States für "PUT"
  const [editId, setEditId] = useState(null);
  const [editNote, setEditNote] = useState("");
  const [editKommentar, setEditKommentar] = useState("");

  // States für "DELETE"
  const [notAuthorized, setNotAuthorized] = useState("");

  const port = import.meta.env.VITE_API_URL;

  const { auth } = useAuth();

  const accessToken = localStorage.getItem("accessToken");

  const api = axios.create({ baseURL: `${port}` });

  // Sound Effects
  function handleMenuBack() {
    const audio = new Audio(menuBackSfx);
    audio.play();
  }

  function playConfirmSound() {
    const audio = new Audio(KommentarGepostetSfx);
    audio.volume = 0.8;
    audio.play();
  }

  function playDeleteSound() {
    const audio = new Audio(deleteSfx);
    audio.volume = 0.8;
    audio.play();
  }

  function playEditedSound() {
    const audio = new Audio(kommentarEditedSfx);
    audio.volume = 0.8;
    audio.play();
  }

  function handleEnterTaste(event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  // Scrollt die Seite ganz nach oben, sobald sie aufgemacht wird.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GET
  const getKommentare = async () => {
    try {
      const response = await api.get("/api/kommentar");

      console.log("GET response:", response);

      const filteredResponse = response.data
        .filter((elem) => elem.gemaeldeId === 4)
        .reverse();

      setKommentarListe(filteredResponse);
      setKeineKommentareMessage("");
      console.log("filteredResponse:", filteredResponse);

      if (filteredResponse.length == 0) {
        setKeineKommentareMessage("Es wurden noch keine Kommentare gepostet.");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    getKommentare();
  }, []);

  // POST
  const handlePost = async (event) => {
    event.preventDefault();
    const kommentar = { note, inhalt };

    try {
      const response = await api.post(`/api/kommentar/${4}`, kommentar, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("POST response:", response);
      setPostResponseMessage("Dein Kommentar wurde gepostet ↓");
      setLeereFelderMeldung("");
      setInhalt("");
      setGepostetVon("");
      setNotAuthorized("");
      playConfirmSound();
      getKommentare();
    } catch (error) {
      console.log(error);
      if ((error.response = 400)) {
        setPostResponseMessage("");
        setLeereFelderMeldung("Bitte fülle alle Felder aus.");
      }
      setPostResponseMessage("");
    }
  };

  // Handle Click Edit
  const handleClickEdit = async (kommentarId) => {
    try {
      const response = await api.get(`/api/kommentar/${kommentarId}`);

      console.log("Click Edit response:", response);

      setEditNote(response.data.note);
      setEditKommentar(response.data.inhalt);
      setEditId(kommentarId);
    } catch (error) {
      console.log("Click Edit error: ", error);
    }
  };

  // UPDATE
  const handleUpdate = async (kommentarId) => {
    const updatedKommentar = {
      note: editNote,
      inhalt: editKommentar,
    };

    try {
      const response = await api.put(
        `/api/kommentar/${kommentarId}`,
        updatedKommentar,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("UPDATE response:", response);
      getKommentare();
      setPostResponseMessage("");
      setNotAuthorized("");
      setLeereFelderMeldung("");
      setEditId(null);
      playEditedSound();
    } catch (error) {
      console.log("UPDATE error:", error);
      setNotAuthorized(error.response.data);
    }
  };

  // DELETE
  const handleDelete = async (kommentarId) => {
    try {
      const response = await api.delete(`/api/Kommentar/${kommentarId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("DELETE response: ", response);

      setPostResponseMessage("");

      setNotAuthorized("");

      setLeereFelderMeldung("");

      playDeleteSound();

      getKommentare();
    } catch (error) {
      console.log("DELETE error: ", error);
      setNotAuthorized(error.response.data);
    }
  };

  return (
    <section className="portrait_Page">
      <div className="portrait_Biographie">
        <NavLink to="/lobby" onClick={handleMenuBack}>
          <p className="zurueckZurLobby">
            <img src={arrowBack} alt="arrowBack" className="arrowBack" />
            Zurück zur Lobby
          </p>
        </NavLink>
        <h1 style={{ fontSize: "3.2rem", color: "white" }}>Sternennacht</h1>
        <div className="flexbox_vertikal">
          <p className="portraitParagraph">
            <br />
            Jahr: 1889 <br /> <br />
            Künstler: Vincent van Gogh (Niederlande)
            <br /> <br />
            Die Sternennacht von Vincent van Gogh wurde gemalt und zeigt einen
            dramatisch leuchtenden Nachthimmel über einem ruhigen Dorf. Der
            Himmel ist in wirbelnden, intensiven Farben dargestellt, die
            Bewegung und Energie vermitteln. Die Zypressen im Vordergrund stehen
            im Kontrast zum lebendigen Himmel und symbolisieren Stabilität. Das
            Gemälde spiegelt van Goghs innere Unruhe und seine psychischen
            Kämpfe wider, die er während seines Aufenthalts in einer
            Nervenheilanstalt erlebte. Es gilt als eines seiner bekanntesten
            Werke und ist heute im Museum of Modern Art in New York ausgestellt.
          </p>
        </div>
        <img
          src={sternenNacht}
          alt="Sternennacht"
          className="portrait_horizontal"
        />
        <br /> <br />
      </div>
      <br /> <br />
      <div>
        {auth.isAuthenticated && (
          <>
            {/* Formular */}
            <div>
              <form onKeyDown={handleEnterTaste} className="kommentarFormular">
                <h1 className="kommentarFelder">Benote dieses Bild:</h1>
                <div className="Note">
                  <label className="radioButtons">
                    <input
                      type="radio"
                      name="note"
                      value={note}
                      onChange={(e) => setNote(1)}
                    />
                    1
                  </label>

                  <label className="radioButtons">
                    <input
                      type="radio"
                      name="note"
                      value={note}
                      onChange={(e) => setNote(2)}
                    />
                    2
                  </label>

                  <label className="radioButtons">
                    <input
                      type="radio"
                      name="note"
                      value={note}
                      onChange={(e) => setNote(3)}
                    />
                    3
                  </label>

                  <label className="radioButtons">
                    <input
                      type="radio"
                      name="note"
                      value={note}
                      onChange={(e) => setNote(4)}
                    />
                    4
                  </label>

                  <label className="radioButtons">
                    <input
                      type="radio"
                      name="note"
                      value={note}
                      onChange={(e) => setNote(5)}
                    />
                    5
                  </label>

                  <label className="radioButtons">
                    <input
                      type="radio"
                      name="note"
                      value={note}
                      onChange={(e) => setNote(6)}
                    />
                    6
                  </label>
                </div>
                <br />
                <div>
                  {/* Meinung zum Bild */}
                  <h1 className="kommentarFelder">Deine Meinung zum Bild:</h1>
                  <textarea
                    id="textFeld"
                    rows={5}
                    cols={70}
                    placeholder="Dein Kommentar"
                    value={inhalt}
                    onChange={(e) => setInhalt(e.target.value)}
                    required
                  />
                </div>
                <br />
                <br /> <br />
                <button type="button" onClick={handlePost} className="button">
                  Posten
                </button>
              </form>
            </div>
            <h2 style={{ backgroundColor: "lightgreen" }}>
              {postResponseMessage}
            </h2>
            <h2 style={{ backgroundColor: "red" }}>{leereFelderMeldung}</h2>
            {/* Kommentare */}
            <section className="kommentarListe">
              <h2>Kommentare:</h2>

              <p
                style={{
                  backgroundColor: "orange",
                  fontSize: "1.3rem",
                }}
              >
                {keineKommentareMessage}
              </p>
              <h3 style={{ backgroundColor: "red" }}>{notAuthorized}</h3>
              {kommentarListe.map((elem) => (
                <div key={elem.id} className="kommentare">
                  {editId === elem.id ? (
                    <img
                      src={check}
                      className="check"
                      onClick={() => handleUpdate(elem.id)}
                    />
                  ) : (
                    <img
                      src={pen}
                      className="pen"
                      onClick={() => handleClickEdit(elem.id)}
                    />
                  )}
                  {editId === elem.id ? (
                    <img
                      src={cross}
                      className="trashBin"
                      onClick={() => {
                        setEditId(null);
                        setNotAuthorized("");
                      }}
                    />
                  ) : (
                    <img
                      src={trashBin}
                      className="trashBin"
                      onClick={() => {
                        handleDelete(elem.id);
                        setPostResponseMessage("");
                      }}
                    />
                  )}
                  <p style={{ fontSize: "1.5rem", paddingTop: "0.5rem" }}>
                    {" "}
                    {elem.gepostetVon}{" "}
                  </p>
                  <br />
                  <strong>Note:</strong> <br />
                  {editId === elem.id ? (
                    <select
                      name="note"
                      id="note"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                    </select>
                  ) : (
                    <p>{elem.note}</p>
                  )}
                  <br />
                  <strong>Kommentar:</strong> <br />
                  {editId === elem.id ? (
                    <textarea
                      rows="10"
                      cols="50"
                      value={editKommentar}
                      onChange={(e) => setEditKommentar(e.target.value)}
                    />
                  ) : (
                    <p>{elem.inhalt}</p>
                  )}
                  <div style={{ textAlign: "right", color: "lightskyblue" }}>
                    <strong>Gepostet am:</strong> {elem.gepostetAm} <br />
                    <br />
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
        <br />
        {!auth.isAuthenticated && (
          <div className="bildKommentierenFrage">
            <h3>Möchtest du das Gemälde bewerten und kommentieren?</h3>
            <NavLink to="/" onClick={handleMenuBack}>
              <p className="navLink"> Registriere dich jetzt</p>
            </NavLink>
          </div>
        )}
      </div>
    </section>
  );
}

export default Sternennacht;
