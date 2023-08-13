import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import faker from "faker";

function App() {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    faker.locale = "ru";
    faker.seed(0);
    const id = faker.datatype.uuid();
    const name = faker.name.findName();
    const address = faker.address.streetAddress();
    const phone = faker.phone.phoneNumberFormat();
    setData([id, name, address, phone]);
  };
  return <>{data}</>;
}

export default App;
