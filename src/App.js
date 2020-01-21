import React, { Component } from 'react';
import Moment from 'react-moment';
import CurrencyFormat from 'react-currency-format';
import Chart from 'react-apexcharts';
import removeBtn from './images/remove.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: '',
      id: '',
      type: '',
      value: '',
      date: '',
      series: [0, 0],
      options: {
        chart: {
          customScale: 0.8,
          type: 'pie',
        },
        labels: ['Renda Fixa', 'Renda Variável'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      }
    };
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidMount() {
    this.callApi()
      .then(res => {
        this.setState({ list: res });
        let rendaFixa = 0;
        let rendaVariavel = 0;
        // eslint-disable-next-line
        Object.keys(this.state.list).map(key => {
          this.state.list[key].Type==='RENDA_VARIAVEL'?rendaVariavel+=this.state.list[key].Value:rendaFixa+=this.state.list[key].Value
        });
        let series = [];
        if (rendaFixa > 0 || rendaVariavel > 0)
          series.push(rendaFixa/(rendaFixa + rendaVariavel), rendaVariavel/(rendaFixa + rendaVariavel));
        this.setState({ series: series });
      })
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('https://igorila-server.herokuapp.com/api/investments');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('https://igorila-server.herokuapp.com/api/investments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.id,
        type: this.state.type,
        value: this.state.value,
        date: this.state.date
      }),
    });
    const body = await response.json();
    this.setState({ list: body });
    let rendaFixa = 0;
    let rendaVariavel = 0;
    // eslint-disable-next-line
    Object.keys(this.state.list).map(key => {
      this.state.list[key].Type==='RENDA_VARIAVEL'?rendaVariavel+=this.state.list[key].Value:rendaFixa+=this.state.list[key].Value
    });
    let series = [];
    if (rendaFixa > 0 || rendaVariavel > 0)
      series.push(rendaFixa/(rendaFixa + rendaVariavel), rendaVariavel/(rendaFixa + rendaVariavel));
    this.setState({ series: series });
  };

  handleRemove = async e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const response = await fetch('https://igorila-server.herokuapp.com/api/investments', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: data.get('removeId')
      }),
    });
    const body = await response.json();
    this.setState({ list: body });
    let rendaFixa = 0;
    let rendaVariavel = 0;
    // eslint-disable-next-line
    Object.keys(this.state.list).map(key => {
      this.state.list[key].Type==='RENDA_VARIAVEL'?rendaVariavel+=this.state.list[key].Value:rendaFixa+=this.state.list[key].Value
    });
    let series = [];
    if (rendaFixa > 0 || rendaVariavel > 0)
      series.push(rendaFixa/(rendaFixa + rendaVariavel), rendaVariavel/(rendaFixa + rendaVariavel));
    this.setState({ series: series });
  };

  render() {
    return (
      <div className="App" class="container">
        <form class="row" onSubmit={this.handleSubmit}>
          <div class="col-1"></div>
          <div class="col-10 input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">Novo Investimento</span>
            </div>
            <select class="custom-select text-center" onChange={e => this.setState({ type: e.target.value })}>
              <option defaultValue>Tipo</option>
              <option value="RENDA_VARIAVEL">Renda Variável</option>
              <option value="RENDA_FIXA">Renda Fixa</option>
            </select>
            <input
              type="text"
              class="form-control text-center"
              placeholder="Valor"
              value={this.state.value}
              onChange={e => this.setState({ value: e.target.value })}
            />
            <input
              type="date"
              class="form-control text-center"
              placeholder="Data"
              value={this.state.date}
              onChange={e => this.setState({ date: e.target.value })}
            />
            <div class="input-group-append">
              <button class="submitInvestmentBtn btn btn-warning" type="submit" id="button-addon2">Adicionar</button>
            </div>
          </div>
          <div class="col-1"></div>
        </form>
        <div class="row">&nbsp;</div>
        <div class="row">
          <div class="col-7">
            <table class="table table-bordered table-hover table-sm text-center">
              <thead class="thead-light">
                <tr>
                  <th scope="col">Tipo</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Data</th>
                  <th scope="col">Remover</th>
                </tr>
              </thead>
              <tbody>
              {Object.keys(this.state.list).map(key => (
                <tr key={key}>
                  <td>{this.state.list[key].Type==='RENDA_VARIAVEL'?'Renda Variável':'Renda Fixa'}</td>
                  <td><CurrencyFormat value={this.state.list[key].Value} displayType={'text'} thousandSeparator={true} prefix={'R$'} /></td>
                  <td><Moment format="DD/MM/YYYY">{this.state.list[key].Date}</Moment></td>
                  <td>
                    <form onSubmit={this.handleRemove}>
                      <input type="text" hidden readOnly name="removeId" value={this.state.list[key].ID}/>
                      <input type="image" name="submit" class="removeBtn mx-auto d-block" src={removeBtn} alt='Remove investment'/>
                    </form>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div class="col-5">
            <div id="chart">
              <Chart options={this.state.options} series={this.state.series} type="pie" width={100+'%'} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
