define([
       "jquery" , "underscore" , "backbone"
       , "models/snippet"
       , "collections/snippets"
    , "views/my-form-snippet"
    , "text!data/n2attributeboolean.json" 
], function(
  $, _, Backbone
  , SnippetModel
  , SnippetsCollection
    , MyFormSnippetView
    , n2AttrBoolean
){
  return SnippetsCollection.extend({
    model: SnippetModel
    , initialize: function() {
      this.counter = {};
      this.on("add", this.giveUniqueIdandN2boolean);
	
    }
    , giveUniqueIdandN2boolean: function(snippet){
	if(!snippet.get("fresh")) {
        return;
      }
      snippet.set("fresh", false);
      var snippetType = snippet.attributes.fields.type.value;

      if(typeof this.counter[snippetType] === "undefined") {
        this.counter[snippetType] = 0;
      } else {
        this.counter[snippetType] += 1;
      }

      snippet.setField("n2id", "nunaliit-" + snippetType + "-" + this.counter[snippetType]);
      if(typeof snippet.get("fields")["id2"] !== "undefined") {
        snippet.setField("id2", snippetType + "2-" + this.counter[snippetType]);
      }
	snippet.mergeField(new Backbone.Model(JSON.parse(n2AttrBoolean)[0]))
      
	
    }
    , giveUniqueId: function(snippet){
      if(!snippet.get("fresh")) {
        return;
      }
      snippet.set("fresh", false);
      var snippetType = snippet.attributes.fields.type.value;

      if(typeof this.counter[snippetType] === "undefined") {
        this.counter[snippetType] = 0;
      } else {
        this.counter[snippetType] += 1;
      }

      snippet.setField("n2id", "nunaliit-" + snippetType + "-" + this.counter[snippetType]);

      if(typeof snippet.get("fields")["id2"] !== "undefined") {
        snippet.setField("id2", snippetType + "2-" + this.counter[snippetType]);
      }
    }
    , containsFileType: function(){
      return !(typeof this.find(function(snippet){
        return snippet.attributes.title === "File Button"
      }) === "undefined");
    }
      , readRapeSnippets: function(rapeJson){
	  
	  this.reset();
	  this.collection.add()
	  

      }
    , renderAll: function(){
      return this.map(function(snippet){
        return new MyFormSnippetView({model: snippet}).render(true);
      })
    }
    , renderAllClean: function(){
      return this.map(function(snippet){
        return new MyFormSnippetView({model: snippet}).render(false);
      });
    }
  });
});
