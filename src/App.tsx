import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import faker from "faker";

function App() {
  const [data, setData] = useState<any[]>([]);
  const [region, setRegion] = useState<string>("en");
  const [seed, setSeed] = useState<string>("0");
  const [errorCount, setErrorCount] = useState<number>(0);

  useEffect(() => {
    generateData();
  }, [region, seed, errorCount]);

  const generateData = () => {
    faker.locale = region;
    faker.seed(parseInt(seed));

    const newData = [];

    for (let i = 0; i < 20; i++) {
      const id = faker.datatype.uuid();
      const name = faker.name.findName();
      const address = faker.address.streetAddress();
      const phone = faker.phone.phoneNumberFormat();
      newData.push({ id, name, address, phone });
    }

    setData(newData);
  };
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
          className="form-control"
          value={errorCount}
          onChange={(e) => setErrorCount(parseInt(e.target.value))}
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
          {data.map((item, index) => (
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
