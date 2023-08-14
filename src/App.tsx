import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import faker from "faker";
import seedrandom from "seedrandom";
const alphabets = {
  en: "abcdefghijklmnopqrstuvwxyz",
  pl: "aąbcćdeęfghijklłmnńoóprsśtuwyzźż",
  fn: "abcdefghijklmnopqrstuvwxyzåäö",
};
function App() {
  const [data, setData] = useState<any[]>([]);
  const [changedData, setChangedData] = useState<any[]>([]);
  const [region, setRegion] = useState<string>("en");
  const [seed, setSeed] = useState<string>("0");
  const [errorCount, setErrorCount] = useState<number>(0);
  interface Idata {
    id: string;
    name: string;
    address: string;
    phone: string;
  }
  useEffect(() => {
    console.log(999);
    generateData();
  }, [region, seed]);

  useEffect(() => {
    if (data.length > 0) {
      console.log(777);
      modifiedData();
    }
  }, [errorCount, data]);

  const generateData = () => {
    faker.locale = region;
    faker.seed(parseInt(seed));
    const data = [];

    for (let i = 0; i < 20; i++) {
      const id = faker.datatype.uuid();
      const name = faker.name.findName();
      const address = faker.address.streetAddress();
      const phone = faker.phone.phoneNumberFormat();
      data.push({ id, name, address, phone });
    }
    setData(data);
  };

  const modifiedData = () => {
    const newData = [];
    data.forEach((item: Idata, index) => {
      const randomGenerator = seedrandom(seed);
      let { id, name, address, phone } = item;
      const qwerty =
        errorCount - Math.floor(errorCount) === 0.5
          ? Math.floor(errorCount) + (Math.floor(name.length) % 2)
          : Math.round(errorCount);
      for (let j = 0; j < qwerty; j++) {
        console.log(qwerty);
        const errorType = ["insert", "delete", "swap"];
        // const errorIndex = Math.floor(randomGenerator() * 3);
        // const qw = (randomGenerator() * name.length) % 3;

        const errorIndex = Math.floor(randomGenerator() * name.length) % 3;
        const randomIndex = Math.floor(randomGenerator() * name.length);
        // console.log(`${errorIndex}`);

        if (errorType[errorIndex] === "insert") {
          // console.log(`${randomIndex}-${randomGenerator()}`);
          // console.log(`${name}---${index}`);
          // console.log(`${randomIndex}`);
          const newRandom = seedrandom(name);
          const getAlphabet = alphabets.en;
          const newIndex = Math.floor(newRandom() * getAlphabet.length);
          const randomLetter = getAlphabet[newIndex];
          // console.log(`${name}`);
          //  console.log(`${name}-${randomLetter}-${randomIndex}`);
          name =
            name.slice(0, randomIndex) + randomLetter + name.slice(randomIndex);
          // console.log(`${name}-${randomLetter}-${randomIndex}`);
        } else if (errorType[errorIndex] === "delete") {
          name = name.slice(0, randomIndex) + name.slice(randomIndex + 1);
        } else if (errorType[errorIndex] === "swap") {
          const nextIndex = randomIndex + 1;
          name =
            name.slice(0, randomIndex) +
            name[nextIndex] +
            name[randomIndex] +
            name.slice(nextIndex + 1);
        }
      }
      newData.push({ id, name, address, phone });
    });
    // console.log(newData);
    setChangedData(newData);
  };
  const displayedData = errorCount === 0 ? data : changedData;
  return (
    <div className="container">
      <h1>Fake Data Generator</h1>
      <div className="form-group">
        <label>Region:</label>
        <select
          className="form-control"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="en">English</option>
          <option value="pl">Polish</option>
          <option value="fi">Finnish</option>
        </select>
      </div>
      <div className="form-group">
        <label>Error Count:</label>
        <input
          type="number"
          step="0.1"
          className="form-control"
          value={errorCount}
          onChange={(e) => {
            setErrorCount(+e.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <label>Seed:</label>
        <input
          type="text"
          className="form-control"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
        />
      </div>
      {/* <button className="btn btn-primary" onClick={generateData}>
        Generate Data
      </button> */}
      <table className="table table-hover table-responsive">
        <thead>
          <tr>
            <th>Number</th>
            <th>Id</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.address}</td>
              <td>{item.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
