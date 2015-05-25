/**
 * Created by luhuijian on 15/5/25.
 */
$(function(){
  var form_selector ='#blog_form_post',
    tags_box ='#tags_box',
    tag_input_selector ='input[name=blog[tags]',
    added_tags = [],
    set_add_tags =function(){
      $('tag_input_selector').each(function(index,element){
        added_tags.push(element.value);
        console.log('success');
      });
    },
    add_tags = function(e){
      var input_ele = $('#tags')[0],
        inputs = input_ele.value.split(/[,;，；]/);
      console.log(inputs.length);
      input_ele.value ="";
      var word;
      for (var i =0;i<inputs.length;i++){
        word =inputs[i];
        word = word.trim();
        if(added_tags.indexOf(word) === -1&& word !== " "){
          added_tags.push(word);
          console.log(word)
          $('<span>').addClass('label label-danger')
            .html(word)
            .append('<button type="button" class="badge">&times;</button>')
            .appendTo(tags_box)
            .fadeIn();

          $('<input>').attr(
            {
              'type':'hidden',
              'name':'blog[tags]',
              'value':word
            }
          ).appendTo(form_selector);
        }
      }
    },

    delete_tags = function(e){
      var $button = $(e.target),
        $parent = $button.parent(),
        $tag_word =$parent[0].firstChild.nodeValue.trim(),
        $tags_inputs =$('input[value="'+$tag_word+'"]').filter('input[name="blog[tags]"]');
      $tags_inputs.remove();
      var index = added_tags.indexOf($tag_word);
      if(index!== -1){
        delete added_tags[index];
      }
      $parent.fadeOut(800,function(){
        $(this).remove();
      })
    }

  $(document).ready(set_add_tags);
  $('#add_tags').click(add_tags);
  $('#tags_box').on('click','button',delete_tags);
})
