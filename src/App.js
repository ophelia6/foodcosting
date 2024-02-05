import React from "react";
import './App.css';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      currentWeight: 0,
      unitWeight: 0,
      currentItem: [],
      selectedList: [],
      yeild: '',
      cost: '',
      costPerUnit: '',
      isResultFound: false,
      showMainWrap: true,
      currentProductName: '',
      totalUnit: 0
    };
    this.handleOnSearch = this.handleOnSearch.bind(this);
    this.addToBucket = this.addToBucket.bind(this);
    this.getCosting = this.getCosting.bind(this);
    this.getNewRecipeCost = this.getNewRecipeCost.bind(this);
    this.removeFromBucket = this.removeFromBucket.bind(this);
  }

  componentDidMount() {
    fetch('./data.json')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            items: result
          });
        }
      )    
  }

    handleOnSearch(string) {
    this.setState({
      currentItem: string
    });
  }

  addToBucket(){
    this.state.currentItem['weight'] = this.state.currentWeight;
    this.state.selectedList.push(this.state.currentItem);
    this.setState({
      selectedList: this.state.selectedList,
      currentWeight: 0
    });
}

  updateWeight(evt) {
    const val = evt.target.value;    
    this.setState({
      currentWeight: val
    });
  }

  updateUnit(evt) {
    const val = evt.target.value;    
    this.setState({
      unitWeight: val
    });
  }

  updateProductName(evt){
    const val = evt.target.value;    
    this.setState({
      currentProductName: val
    });
  }

  getCosting(){
    var yeild = 0;
    var totalCost = 0;
    for(var i=0;i<this.state.selectedList.length;i++){
        yeild = yeild +  parseInt(this.state.selectedList[i].weight); 
        totalCost = totalCost + ((this.state.selectedList[i].price/this.state.selectedList[i].vol)*this.state.selectedList[i].weight);
    }
    totalCost = parseFloat(totalCost.toFixed(2));

 
    var unit = this.state.unitWeight;
    var unitCost = totalCost / (yeild/parseInt(unit));
    unitCost = unitCost.toFixed(2);
    var totalUnit = yeild / parseInt(unit);
    totalUnit = totalUnit.toFixed(2)

    this.setState({
      yeild: yeild,
      cost:totalCost,
      isResultFound:true,
      showMainWrap:false,
      costPerUnit: unitCost,
      totalUnit: totalUnit,
    });
}

removeFromBucket(){
  console.log("item");
}

getNewRecipeCost(){
  this.setState({
    selectedList: [],
    isResultFound:false,
    showMainWrap:true
  });
}

  render() {
    return (
      <div className="App"> 
      <h1>Cost calculator for any recipe!</h1>
      {this.state.showMainWrap === true &&
      <div className="Main-wrap">
      <div className="Question-wrap">
          <div className="title-name Title">Product name</div>
          <input type="text" name="Product-name" value={this.state.productName} onChange={evt => this.updateProductName(evt)}></input>
          <div className="Main-title Title">Add ingredient used in the recipe</div>
          <ReactSearchAutocomplete
                items={this.state.items}
                placeholder="butter"
                onSelect={this.handleOnSearch}
                autoFocus
              />

            <div className="Weight-title Title">Add weight in grams used in the recipe</div>
            <input type="text" name="weight" value={this.state.currentWeight} onChange={evt => this.updateWeight(evt)}></input>
            <div className="Add-item" onClick={this.addToBucket}>Add to list</div>
            <div className="Select-list">
              <div className="Select-title">Ingredients used.</div>
              <ul>
              {this.state.selectedList.map(function(item, i){
                return <li key={i}><div className="List-name">{item.name}<span> ({item.weight} grams)</span></div></li>
              })}
              </ul>
            </div>
            <div className="Title">Add per unit weight in grams.</div>
            <input type="text" name="unit" onChange={evt => this.updateUnit(evt)}></input>
          </div> 
          
          <div className="Get-result-wrap">
            <div className="Result Title">If all ingredients added, click below to get total cost to prepare the recipe.</div>
            <div className="Cost-btn" onClick={this.getCosting}>Find costing</div>
          </div>
          <div className="Footer">Made with love by Ophelia.</div>
      </div> 
      
      }
      
      {this.state.isResultFound === true &&
        <div className="Result-wrap">
          <div className="Result-content">
          <div className="Result-name Title">Product Name: <span>{this.state.currentProductName}</span> </div>
            <div className="Result Title"> 
            Total recipe weight will be <span>{this.state.yeild} grams</span> and cost to make this recipe will be <span>{this.state.cost} rupees</span>.
            </div>
            <div className="Result Title"> 
            Total number of units(cookies/cakes) are <span>{this.state.totalUnit} </span> and cost per unit is <span>{this.state.costPerUnit} rupees</span>.
            </div>
          </div>
          <div className="New-recipe Cost-btn" onClick={this.getNewRecipeCost}>Get new recipe cost</div>
        </div>
        
      }

      
    </div>
    )
  }
}
 
export default App;
