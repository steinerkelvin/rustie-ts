{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        rust = pkgs.rust-bin.stable.latest.default;
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs
            pkgs.yarn
          ];
        };
      }
    );
}
