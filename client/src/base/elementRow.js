import Table from "react-bootstrap";

const ElementRow = ({ rows }) => {
  return (
    <>
      {rows.map((row) => (
        <>
          <hr />
          <b>{row.name}</b>
          {row.code}
        </>
      ))}
      <hr />
    </>
  );
};

export default ElementRow;
