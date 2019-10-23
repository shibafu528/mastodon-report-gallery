import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

class Report extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {report: {reporter, comment, statuses}} = this.props;

    return (
      <div className={"report"}>
        <div className={"report__reporter"}>
          <a href={reporter.url}><img src={reporter.avatar} width={32} height={32}/> {reporter.name} (@{reporter.acct})</a> さんの通報
        </div>
        <div className={"report__comment"}>{comment}</div>
        <div className={"report__triangle"}/>
        {statuses.map(st =>
          <div className={"report__status"} dangerouslySetInnerHTML={{__html: st.embed.html}}/>
        )}
      </div>
    );
  }
}

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initializing: true,
      error: null,
      reports: []
    };
  }

  async componentDidMount() {
    try {
      const res = await axios.get('/api/reports');
      this.setState({
        initializing: false,
        reports: res.data
      });
    } catch (e) {
      this.setState({
        initializing: false,
        error: e
      })
    }
  }

  render() {
    const {initializing, error, reports} = this.state;

    if (initializing) {
      return <div>よみこみちう</div>;
    }

    if (error) {
      return <div>しんだ</div>;
    }

    return reports.map(r => <Report report={r}/>);
  }
}

ReactDOM.render(<App/>, document.getElementById("app"));
