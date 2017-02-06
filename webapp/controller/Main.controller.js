sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	
	var _view;
	
	return Controller.extend("sap.training.diagramDiagramExercise.controller.Main", {
		
		onInit: function(){
			this.currentVizFrame = "vizFrame";
			this.currentSelectedDimension = "0";
			_view = this.getView();
			this._createFeedMap();
			this._createDataSetMap();
			
			this._createLineDiagram();
			this._createColumnChart();
			this._createTable();
			
			this._createSelector();
		},
		
		attachContentChange: function(oEvent){
			var sSelectedVizFrame = oEvent.getParameter("selectedItemId");
			if( sSelectedVizFrame.indexOf("table") === -1 ){
				this.currentVizFrame = sSelectedVizFrame.split("--")[1];
				this._handleSelection(this.currentSelectedDimension);
			}
		},
		
		onHandleSelection: function(oEvent){
			this.currentSelectedDimension = oEvent.getParameter("selectedItem").getKey();
			this._handleSelection(this.currentSelectedDimension);
		},
		
		_createSelector: function(){
			var oViewSelector = _view.byId("dimSelector");
			var oItemBuyer = new sap.ui.core.Item({
				key: "0",
				text: "Buyer"
			});
			var oItemCurrency = new sap.ui.core.Item({
				key: "1",
				text: "Currency"
			});
			var oItemBuyerCurrency = new sap.ui.core.Item({
				key: "2",
				text: "Buyer & Currency"
			});
			oViewSelector.addItem(oItemBuyer);
			oViewSelector.addItem(oItemCurrency);
			oViewSelector.addItem(oItemBuyerCurrency);
		},
		
		_createTable: function(){
			var oTable = _view.byId("table");
			oTable.addColumn(new sap.m.Column({header : new sap.m.Label({text: "Buyer"})}));
			oTable.addColumn(new sap.m.Column({header : new sap.m.Label({text: "Currency"})}));
			oTable.addColumn(new sap.m.Column({header : new sap.m.Label({text: "Amount"})}));
			
			var oTableTemplate = new sap.m.ColumnListItem({
				type: sap.m.ListType.Active,
				cells: [ new sap.m.Label({text: "{BuyerName}"}),
						 new sap.m.Label({text: "{CurrencyCode}"}),
						 new sap.m.Label({text: "{GrossAmount}"})
					]
			});
			
			oTable.bindItems("/SalesOrderSet", oTableTemplate, null, null);
		},	
		
		_createColumnChart: function(){
			var oVizFrameBar = _view.byId("vizFrameBar");
			
			oVizFrameBar.setDataset(this._createDataSet());
			oVizFrameBar.setVizProperties({
				plotArea:{
					dataLabel:{
						visible: true
					}
				},
				title:{
					visible: true
				}
			});
			oVizFrameBar.setVizType('column');
		},
		
		_createFeedMap: function(){
			this.feedMap = {};
			
			this.feedMap.grossamount = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid':"valueAxis",
				'type': "Measure",
				'values':["GrossAmount"]
			}) ;    
			
			this.feedMap.buyername = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid':"categoryAxis",
				'type': "Dimension",
				'values':["BuyerName"]
			}) ;    
			
			this.feedMap.currencycode = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid':"categoryAxis",
				'type': "Dimension",
				'values':["CurrencyCode"]
			}) ;  
			
			this.feedMap.buyername_currencycode = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid':"categoryAxis",
				'type': "Dimension",
				'values':["BuyerName","CurrencyCode"]
			}) ;  
		},
		
		_createDataSetMap: function(){
			this.dataSetMap = {};
			
			this.dataSetMap.buyernameDim = new sap.viz.ui5.data.DimensionDefinition({
				name: "BuyerName",
				value: "{BuyerName}"
			});
			
			this.dataSetMap.currencycodeDim = new sap.viz.ui5.data.DimensionDefinition({
				name: "CurrencyCode",
				value: "{CurrencyCode}"
			});
			
			this.dataSetMap.grossamountMeasure = new sap.viz.ui5.data.MeasureDefinition({
				name: "GrossAmount",
				value: "{GrossAmount}"
			});
		},
		
		_createDataSet: function(){
			var oDataSet = new sap.viz.ui5.data.FlattenedDataset({
				data: {
					path: "/SalesOrderSet"	
				}
			});
			return oDataSet;
		},
		
		_handleSelection: function(selectedItem){
			var oVizFrame = _view.byId(this.currentVizFrame);
			var oDataset = oVizFrame.getDataset()
			
			oDataset.removeAllDimensions();
			oDataset.removeAllMeasures();
			
			oVizFrame.removeAllFeeds();
			
			oDataset.addMeasure(this.dataSetMap.grossamountMeasure);
			oVizFrame.addFeed(this.feedMap.grossamount);
			
			if (selectedItem === "0"){
				oDataset.addDimension(this.dataSetMap.buyernameDim);
				oVizFrame.addFeed(this.feedMap.buyername);
				
			}else if (selectedItem === "1"){
				oDataset.addDimension(this.dataSetMap.currencycodeDim);
				oVizFrame.addFeed(this.feedMap.currencycode);
			
			}else if(selectedItem === "2"){
				oDataset.addDimension(this.dataSetMap.buyernameDim);
				oDataset.addDimension(this.dataSetMap.currencycodeDim);
				oVizFrame.addFeed(this.feedMap.buyername_currencycode);
			}
		},
		
		_createLineDiagram: function(){
			var oVizFrame = _view.byId("vizFrame");
			var oPop = _view.byId("popOver");
			oVizFrame.setDataset(this._createDataSet());
			this._handleSelection(this.currentSelectedDimension);
			oVizFrame.setVizProperties({
				plotArea:{
					dataLabel:{
						visible: true
					}
				},
				title:{
					visible: true
				}
			});
			oVizFrame.setVizType('line');
			oPop.connect(oVizFrame.getVizUid());
		}

	});
});