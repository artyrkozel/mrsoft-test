import React, {ChangeEvent, useEffect, useState} from 'react';
import './scss/style.scss'

type ResponseType = {
    data: Array<string>
}

function App() {

    const [data, setData] = useState<Array<string>>()
    const [filteredArr, setFiltered] = useState<Array<string>>()
    const [value, setValue] = useState<any>()
    const [checked, setChecked] = useState<any>(false)
    const [error, setError] = useState('')
    const regExpression = checked ? RegExp(`${value}`, 'g') : RegExp(`${value}`, 'gi');

    async function getData(): Promise<ResponseType> {
        const response = await fetch('https://cors-anywhere.herokuapp.com/https://www.mrsoft.by/data.json', {
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Origin" : 'https://artyrkozel.github.io'}
        })
        return await response.json()
    }
    useEffect(() => {
        getData().then(res => setData(res.data))
    }, [])

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError('')
        setValue(e.currentTarget.value)
    }
    const isCheckedHandler = (event: ChangeEvent<HTMLInputElement>) => setChecked(event.target.checked)

    const onClickByLengthHandler = () => {
        if (isNaN(value) || value === '') {
            setError('Enter number')
            setValue('')
        } else {
            setFiltered(data?.filter(str => str.length > +value))
            setValue('')
        }
    }

    const onClickBySymbolsHandler = () => {
        if(isNaN(value) && value !== '' ){
            const filteredArr = [] as Array<string>
            data?.map(str => str.match(regExpression) ? filteredArr.push(str) : '')
            setFiltered(filteredArr)
            setValue('')
        } else {
            setError('Enter string')
            setValue('')
        }
    }

    return (
        <div className="app">
            <div className="container">
                <div className="app__inner">
                    <div className="wrapper">
                        <input className="app__input" type="text" onChange={onChangeInputHandler} value={value}
                               placeholder="Enter value"/>
                        {error && <div className="error">{error}</div>}
                        <input className="app__checkbox" type="checkbox" value={checked} onChange={isCheckedHandler}/>
                        <div className="app__buttons">
                            <button className="app__buttons-item" onClick={onClickByLengthHandler}>By length</button>
                            <button className="app__buttons-item" onClick={onClickBySymbolsHandler}>By symbols</button>
                        </div>
                    </div>
                    <div className="app__field">
                        {filteredArr?.length === 0 ? <div>No matches</div> : ''}
                        {filteredArr ? filteredArr.map((el: string) => <span className="app__field-item" key={el}>{el}</span>) : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
