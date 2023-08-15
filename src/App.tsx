import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import faker from "faker";
import seedrandom from "seedrandom";
import InfiniteScroll from "react-infinite-scroll-component";
import { CSVLink } from "react-csv";
const alphabets = {
  en: "abcdefghijklmnopqrstuvwxyz",
  pl: "aąbcćdeęfghijklłmnńoóprsśtuwyzźż",
  fn: "abcdefghijklmnopqrstuvwxyzåäö",
};
function App() {
  const [data, setData] = useState<Idata[]>([]);
  const [changedData, setChangedData] = useState<Idata[]>([]);
  const [region, setRegion] = useState<string>("en");
  const [seed, setSeed] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [count, setCount] = useState<number>(20);
  const [page, setPage] = useState<number>(1);
  interface Idata {
    id: string;
    name: string;
    address: string;
    phone: string;
  }
  useEffect(() => {
    generateData(count);
  }, [region, seed, count]);

  useEffect(() => {
    if (data.length > 0) {
      modifiedData();
    }
  }, [errorCount, data]);

  const generateData = (count: number) => {
    faker.locale = region;
    faker.seed(seed);
    const data = [];

    for (let i = 0; i < count; i++) {
      const id = faker.datatype.uuid();
      const name = faker.name.findName();
      const address = faker.address.streetAddress();
      const phone = faker.phone.phoneNumberFormat();
      data.push({ id, name, address, phone });
    }
    setData(data);
  };

  const generateSeed = () => {
    setSeed(Math.floor(Math.random() * 1000));
  };
  const phoneFormatter = (phoneNumber: string) => {
    return phoneNumber
      .split("-")
      .join("")
      .replace(/(\d{3})(?=\d)/g, "$1-");
  };
  const stringFormatter = (string: string) => {
    return string.replace(/\.\s+([a-z])[^.]|(^|\s)\S|^(\s*[a-z])[^\.]/g, (s) =>
      s.replace(/([a-z])/, (s) => s.toUpperCase())
    );
  };

  const prepareCSVData = (data: Idata[]) => {
    return data.map((item, index) => ({
      Number: index + 1,
      Id: item.id,
      Name: item.name,
      Address: item.address,
      Phone: item.phone,
    }));
  };

  const modifiedData = () => {
    const newData: Idata[] = [];
    data.forEach((item: Idata) => {
      const randomGenerator = seedrandom(seed.toString());
      let { id, name, address, phone } = item;

      const calcErrCount =
        errorCount - Math.floor(errorCount) === 0.5
          ? Math.floor(errorCount) + (Math.floor(name.length) % 2)
          : Math.round(errorCount);
      for (let j = 0; j < calcErrCount; j++) {
        const errorType = ["insert", "delete", "swap"];
        const errorIndex = Math.floor(randomGenerator() * name.length) % 3;
        const error = errorType[errorIndex];

        const dataFields = ["name", "address", "phone"];
        const randomFieldIndex = Math.floor(randomGenerator() * 3);
        const selectedField = dataFields[randomFieldIndex];

        let changedValue = "";
        if (selectedField === "name") {
          changedValue = name;
        } else if (selectedField === "phone") {
          changedValue = phone;
        } else if (selectedField === "address") {
          changedValue = address;
        }

        const modifiedValue = ((field) => {
          const randomIndex = Math.floor(randomGenerator() * field.length);
          if (error === "insert") {
            const newRandom = seedrandom(field);
            let randomSymbol;
            if (selectedField == "phone") {
              randomSymbol = Math.floor(newRandom() * 9);
              return phoneFormatter(
                (field =
                  field.slice(0, randomIndex) +
                  randomSymbol +
                  field.slice(randomIndex))
              );
            } else {
              const getAlphabet = alphabets.en;
              const newIndex = Math.floor(newRandom() * getAlphabet.length);
              randomSymbol = getAlphabet[newIndex];
              return stringFormatter(
                (field =
                  field.slice(0, randomIndex) +
                  randomSymbol +
                  field.slice(randomIndex))
              );
            }
          } else if (error === "delete") {
            let newRandomIndex = Math.floor(randomGenerator() * field.length);
            if (selectedField == "phone") {
              field = field.split("-").join("");
              newRandomIndex = Math.floor(randomGenerator() * field.length);
              return phoneFormatter(
                (field =
                  field.slice(0, newRandomIndex) +
                  field.slice(newRandomIndex + 1))
              );
            } else {
              return stringFormatter(
                (field =
                  field.slice(0, newRandomIndex) +
                  field.slice(newRandomIndex + 1))
              );
            }
          } else if (error === "swap") {
            if (selectedField == "phone") {
              field = field.split("-").join("");
              const randomIndex = Math.floor(randomGenerator() * field.length);
              const newRandomIndex =
                randomIndex == field.length - 1 ? randomIndex - 1 : randomIndex;
              const nextIndex = newRandomIndex + 1;
              return phoneFormatter(
                (field =
                  field.slice(0, randomIndex) +
                  field[nextIndex] +
                  field[randomIndex] +
                  field.slice(nextIndex + 1))
              );
            } else {
              const newRandomIndex =
                randomIndex == field.length - 1 ? randomIndex - 1 : randomIndex;
              const nextIndex = newRandomIndex + 1;
              return stringFormatter(
                (field =
                  field.slice(0, randomIndex) +
                  field[nextIndex] +
                  field[randomIndex] +
                  field.slice(nextIndex + 1))
              );
            }
          }
        })(changedValue);

        if (modifiedValue) {
          if (selectedField === "name") {
            name = modifiedValue;
          } else if (selectedField === "phone") {
            phone = modifiedValue;
          } else if (selectedField === "address") {
            address = modifiedValue;
          }
        }
      }
      newData.push({ id, name, address, phone });
    });
    setChangedData(newData);
  };
  const displayedData = errorCount === 0 ? data : changedData;
  return (
    <div className="container">
      <h1>Fake Data Generator</h1>
      <div className="toolbar d-flex justify-content-around gap-4">
        <div className="form-group col-sm">
          <select
            className="form-select"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="en">English</option>
            <option value="fi">Finnish</option>
            <option value="pl">Polish</option>
          </select>
        </div>
        <div className="form-group col-sm">
          <input
            type="range"
            min={0}
            max={10}
            step={0.25}
            value={errorCount}
            onChange={(e) => setErrorCount(parseFloat(e.target.value))}
            className="form-range"
          />
        </div>

        <div className="form-group col-sm">
          <input
            type="number"
            step="0.25"
            className="form-control"
            value={errorCount}
            onChange={(e) => {
              setErrorCount(+e.target.value);
            }}
          />
        </div>
        <div className="form-group col-sm text-center">
          <button className="btn btn-primary" onClick={() => generateSeed()}>
            Generate Seed
          </button>
        </div>
        <div className="form-group col-sm">
          <input
            type="text"
            className="form-control"
            value={seed ? seed - page : 0}
            onChange={(e) =>
              setSeed(+e.target.value ? +e.target.value + page : 0)
            }
          />
        </div>
        <div className="form-group col-sm text-center">
          <CSVLink
            separator=";"
            data={prepareCSVData(displayedData)}
            filename={"data.csv"}
            className="btn btn-primary"
          >
            Export to CSV
          </CSVLink>
        </div>
      </div>
      <InfiniteScroll
        dataLength={displayedData.length}
        next={() => {
          setPage((prevPage) => prevPage + 1);
          setCount((prevCount) => prevCount + 10);
        }}
        hasMore={true}
        loader={<h4 className="text-center text-primary">Loading...</h4>}
        scrollThreshold={1}
      >
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
      </InfiniteScroll>
    </div>
  );
}

export default App;
