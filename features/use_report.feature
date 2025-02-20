Feature: Report Usage
  <In order to> navigate the feature documentation report
  <As a> someone viewing the HTML report in a web browser
  <I want> to be able to navigate the report with the built-in functionality

  Background:
    Given there is a file named 'dog_care.feature' with the following contents:
      """
      Feature: Dog Care
        <In order to> care for and enjoy my pet
        <As a> dog owner
        <I want> interact with my dog

        Background:
          Given I have a dog

        @feeding
        Scenario: Feeding the Dog
          Given the dog is hungery
          When I give dog food to the dog
          Then the dog will eat it

        @petting
        Scenario Outline: Petting the Dog
          Dog's do not like to be pet in the wrong direction.

          When I pet the dog's hair <direction:>
          Then the dog will <result>

          Examples:
            | direction: | result       |
            | backwards  | lick my hand |
            | forwards   | growl        |
      """
    And there is a file named 'cat_care.feature' with the following contents:
      """
      Feature: Cat Care
        <In order to> care for and enjoy my pet
        <As a> cat owner
        <I want> interact with my cat

        Background:
          Given I have a cat

        @feeding
        Scenario: Feeding the Cat
          Given the cat is hungery
          When I give the following food to the cat:
            | fish  |
            | steak |
          Then the cat will eat it

        @petting
        Scenario Outline: Petting the Cat
          Cat's do not like to be pet in the wrong direction.

          When I pet the cat's hair <direction:>
          Then the cat will hiss

          Examples:
            | direction: |
            | backwards  |
            | forwards   |
      """

  Scenario: Generating a report when no feature files are provided
    When a report is generated with the code "new Generator().generate()"
    Then the report will contain 0 features
    And the sidebar will contain 0 feature buttons

  Scenario: Clicking the feature buttons
    Given there is a report for the following feature files:
      | dog_care.feature |
      | cat_care.feature |
    And the first feature is displayed
    And the scenario buttons for the first feature are expanded in the sidebar
    When the second feature button is clicked
    Then the second feature will be displayed
    And the scenario buttons for the second feature will be expanded in the sidebar

  Scenario: Clicking the scenario buttons
    Given there is a report for the feature file 'dog_care.feature'
    And the report will contain 2 scenarios
    When the first scenario button is clicked
    Then the first scenario button will be highlighted
    And the first scenario will be scrolled into view
    When the second scenario button is clicked
    Then the second scenario button will be highlighted
    And the second scenario will be scrolled into view

  Scenario: Scrolling through the scenarios in a feature
    Given there is a report for the feature file 'dog_care.feature'
    When the first scenario is scrolled into view
    Then the first scenario button will be highlighted
    When the second scenario is scrolled into view
    Then the second scenario button will be highlighted
