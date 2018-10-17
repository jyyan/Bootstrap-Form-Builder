define([
       "jquery", "underscore", "backbone"
      , "views/temp-snippet"
      , "helper/pubsub"
      , "text!templates/app/renderform.html"
], function(
  $, _, Backbone
  , TempSnippetView
  , PubSub
  , _renderForm
){
  return Backbone.View.extend({
    tagName: "fieldset"
    , initialize: function(){
      this.collection.on("add", this.render, this);
      this.collection.on("remove", this.render, this);
      this.collection.on("change", this.render, this);
      PubSub.on("mySnippetDrag", this.handleSnippetDrag, this);
      PubSub.on("tempMove", this.handleTempMove, this);
      PubSub.on("tempDrop", this.handleTempDrop, this);
      PubSub.on("loadingExistingSchema", this.handleLoadingSchema, this);
      this.$build = $("#build");
      this.renderForm = _.template(_renderForm);
      var that = this;
      $("button.schemsubmit").on("click", function(){
        that.collection.readRapeSnippets();
      });
      this.render();

    }
    , handleLoadingSchema : function(model){
        this.collection.readRapeSnippets();

    }

    , render: function(){
      //Render Snippet Views
      this.$el.empty();
      var that = this;
      var containsFile = false;
      //for read json test

	_.each(this.collection.renderAll(), function(snippet){
        that.$el.append(snippet);
      });
	var partitedEleMandatory = _.filter(this.collection.renderAll(), function(e){
	    if($(e).attr("data-title")
		=== "n2 schema info")
	    {
		return true;
	    }
	    else {
		return false;
	    }
	} )
	var partitedEleAttribute  = _.reject(this.collection.renderAll(), function(e){
	    if( ($(e).attr("data-title")
		 === "n2 schema info") )
	    {
		return true;
	    }
	    else
	    {
		return false;
	    }
	} )

      $("#render").val(that.renderForm({
          multipart: this.collection.containsFileType(),
	  mandatorytext: _.map( partitedEleMandatory, function(e){
	      return $(e).attr("json-content")}).join("\n"),
	  attributestext: _.map( partitedEleAttribute,
	      function(e){
        	  return " {\n" + $(e).attr("json-content").replace(/^/gm, '        ')+ "}"}).join()
      }
			));
      this.$el.appendTo("#build form");
      this.delegateEvents();
    }

    , getBottomAbove: function(eventY){
      var myFormBits = $(this.$el.find(".component"));
      var topelement = _.find(myFormBits, function(renderedSnippet) {
        if (($(renderedSnippet).position().top + $(renderedSnippet).height()) > eventY  - 90) {
          return true;
        }
        else {
          return false;
        }
      });
      if (topelement){
        return topelement;
      } else {
        return myFormBits[0];
      }
    }

    , handleSnippetDrag: function(mouseEvent, snippetModel) {
      $("body").append(new TempSnippetView({model: snippetModel}).render());
      this.collection.remove(snippetModel);
      PubSub.trigger("newTempPostRender", mouseEvent);
    }

    , handleTempMove: function(mouseEvent){
      $(".target").removeClass("target");
      if(mouseEvent.pageX >= this.$build.position().left &&
          mouseEvent.pageX < (this.$build.width() + this.$build.position().left) &&
          mouseEvent.pageY >= this.$build.position().top &&
          mouseEvent.pageY < (this.$build.height() + this.$build.position().top)){
        $(this.getBottomAbove(mouseEvent.pageY)).addClass("target");
      } else {
        $(".target").removeClass("target");
      }
    }

    , handleTempDrop: function(mouseEvent, model, index){
      if(mouseEvent.pageX >= this.$build.position().left &&
         mouseEvent.pageX < (this.$build.width() + this.$build.position().left) &&
         mouseEvent.pageY >= this.$build.position().top &&
         mouseEvent.pageY < (this.$build.height() + this.$build.position().top)) {
        var index = $(".target").index();
        $(".target").removeClass("target");
        this.collection.add(model,{at: index+1});
      } else {
        $(".target").removeClass("target");
      }
    }
  })
});
