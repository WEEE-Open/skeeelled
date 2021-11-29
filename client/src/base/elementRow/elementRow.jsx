import Table from 'react-bootstrap/Table'

const ElementRow = ({ rows }) => {
	return (<>
		{rows.map(row => {
			<hr/>
			{row.map(data => (
				<b>{data}</b>
			))}
		})}
	</>)
}

export default ElementRow
